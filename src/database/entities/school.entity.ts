import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  SchoolRoleEnum,
  SchoolStatusEnum,
  type SchoolRoleValue,
  type SchoolStatusValue,
} from '../../common/constants/auth.constants';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'school_name', type: 'varchar', length: 255 })
  school_name: string;

  @Column({ name: 'owner_name', type: 'varchar', length: 255 })
  owner_name: string;

  @Column({ name: 'school_address', type: 'varchar', length: 500 })
  school_address: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  password_hash: string;

  @Column({
    type: 'enum',
    enum: [
      SchoolRoleEnum.SUPERADMIN,
      SchoolRoleEnum.ADMIN,
      SchoolRoleEnum.TEACHER,
      SchoolRoleEnum.STUDENT,
    ],
    default: SchoolRoleEnum.ADMIN,
  })
  role: SchoolRoleValue;

  @Column({
    type: 'enum',
    enum: [
      SchoolStatusEnum.PENDING,
      SchoolStatusEnum.APPROVED,
      SchoolStatusEnum.REJECTED,
    ],
    default: SchoolStatusEnum.PENDING,
  })
  status: SchoolStatusValue;

  @Column({ name: 'school_id', type: 'varchar', length: 32, unique: true })
  school_id: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  otp: string | null;

  @Column({ name: 'otp_expires_at', type: 'timestamp', nullable: true })
  otp_expires_at: Date | null;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false })
  is_email_verified: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
