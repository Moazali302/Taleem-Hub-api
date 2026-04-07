import { Controller, Get, Patch, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FeesService } from './fees.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('fees')
@UseGuards(JwtAuthGuard, TenantGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get()
  findAll() {
    return this.feesService.findAll();
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.feesService.findByStudent(studentId);
  }

  @Patch(':id/mark-paid')
  markAsPaid(@Param('id') id: string) {
    return this.feesService.markAsPaid(id);
  }

  @Get(':id/challan')
  generateChallan(@Param('id') id: string) {
    return this.feesService.generateChallan(id);
  }

  @Post('notify/:studentId')
  notifyStudent(@Param('studentId') studentId: string) {
    return this.feesService.notifyStudent(studentId);
  }

  @Get('overdue')
  getOverdueFees() {
    return this.feesService.getOverdueFees();
  }
}
