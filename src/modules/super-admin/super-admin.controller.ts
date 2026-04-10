import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('schools')
  getAllSchools() {
    return this.superAdminService.getAllSchools();
  }

  @Get('schools/:id')
  getSchool(@Param('id') id: string) {
    return this.superAdminService.getSchool(id);
  }

  @Patch('schools/:id/block')
  blockSchool(@Param('id') id: string) {
    return this.superAdminService.blockSchool(id);
  }

  @Patch('schools/:id/unblock')
  unblockSchool(@Param('id') id: string) {
    return this.superAdminService.unblockSchool(id);
  }

  @Get('revenue')
  getRevenue() {
    return this.superAdminService.getRevenue();
  }

  @Get('audit-logs')
  getAuditLogs() {
    return this.superAdminService.getAuditLogs();
  }
}
