import { Injectable, ConflictException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { School } from '../../database/entities/school.entity';
import { User } from '../../database/entities/user.entity';
import { CreateSchoolDto } from './dto/create-school.dto';
import { BCRYPT_SALT_ROUNDS, SchoolRoleEnum } from '../../common/constants/auth.constants';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(School) private readonly schoolRepo: Repository<School>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateSchoolDto) {
    const [existingUser, password_hash, school_id] = await Promise.all([
      this.userRepo.findOne({ where: { email: dto.email.toLowerCase().trim() } }),
      bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS),
      this.generateUniqueSlug(dto.school_name),
    ]);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    return this.dataSource.transaction(async (manager) => {
      const school = manager.create(School, {
        school_name: dto.school_name.trim(),
        school_address: dto.school_address.trim(),
        school_id,
      });
      const savedSchool = await manager.save(school);

      const user = manager.create(User, {
        name: dto.owner_name.trim(),
        phone: dto.owner_number.trim(),
        email: dto.email.toLowerCase().trim(),
        password_hash,
        role: SchoolRoleEnum.ADMIN,
        is_active: true,
        email_verified: false,
        school: savedSchool,
      });
      const savedUser = await manager.save(user);

      const { password_hash: _, otp: __, ...userSafe } = savedUser;

      return { school: savedSchool, admin: userSafe };
    });
  }

  private async generateUniqueSlug(schoolName: string): Promise<string> {
    const base = schoolName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    let candidate = base;
    let counter = 1;

    while (await this.schoolRepo.exist({ where: { school_id: candidate } })) {
      candidate = `${base}-${counter}`;
      counter++;
    }
    return candidate;
  }
}