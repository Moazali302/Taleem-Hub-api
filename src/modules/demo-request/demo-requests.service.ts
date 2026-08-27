import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemoRequest } from '../../database/entities/demo-request.entity';
import { CreateDemoRequestDto } from './dto/create-demo-request.dto';
import { UpdateDemoRequestStatusDto } from './dto/update-demo-request-status.dto';

@Injectable()
export class DemoRequestsService {
  constructor(
    @InjectRepository(DemoRequest)
    private readonly demoRequestRepo: Repository<DemoRequest>,
  ) {}

  // Called from the public website's "Request a demo" form — no auth.
  create(dto: CreateDemoRequestDto): Promise<DemoRequest> {
    const demoRequest = this.demoRequestRepo.create({
      full_name: dto.fullName,
      school_name: dto.schoolName,
      email: dto.email,
      phone: dto.phone,
      message: dto.message ?? null,
    });
    return this.demoRequestRepo.save(demoRequest);
  }

  findAll(status?: string): Promise<DemoRequest[]> {
    return this.demoRequestRepo.find({
      where: status ? { status } : {},
      order: { created_at: 'DESC' },
    });
  }

  async updateStatus(
    id: string,
    dto: UpdateDemoRequestStatusDto,
  ): Promise<DemoRequest> {
    const demoRequest = await this.demoRequestRepo.findOne({ where: { id } });
    if (!demoRequest) {
      throw new NotFoundException('Demo request not found');
    }
    demoRequest.status = dto.status;
    return this.demoRequestRepo.save(demoRequest);
  }
}