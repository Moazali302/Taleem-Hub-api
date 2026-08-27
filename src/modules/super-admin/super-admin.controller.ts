import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdatePackageDto } from './dto/update-package.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import {
  CurrentUser,
  type TaleemAuthUser,
} from '../../common/decorators/current-user.decorator';

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

  @Patch('schools/:id/package')
  updatePackage(@Param('id') id: string, @Body() dto: UpdatePackageDto) {
    return this.superAdminService.updatePackage(id, dto);
  }

  @Get('finance/summary')
  getFinanceSummary(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.superAdminService.getFinanceSummary(from, to);
  }

  // Kept for backward compatibility with the existing frontend
  // API constant (SUPER_ADMIN.REVENUE) — same data as finance/summary.
  @Get('revenue')
  getRevenue(@Query('from') from?: string, @Query('to') to?: string) {
    return this.superAdminService.getFinanceSummary(from, to);
  }

  @Get('finance/expenses')
  listExpenses(@Query('from') from?: string, @Query('to') to?: string) {
    return this.superAdminService.listExpenses(from, to);
  }

  @Post('finance/expenses')
  addExpense(
    @Body() dto: CreateExpenseDto,
    @CurrentUser() user?: TaleemAuthUser,
  ) {
    return this.superAdminService.addExpense(dto, user ? +user.id : undefined);
  }

  @Get('audit-logs')
  getAuditLogs() {
    return this.superAdminService.getAuditLogs();
  }
}