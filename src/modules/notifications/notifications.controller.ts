import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard, TenantGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('logs')
  getLogs() {
    return this.notificationsService.getLogs();
  }

  @Post('resend/:logId')
  resend(@Param('logId') logId: string) {
    return this.notificationsService.resend(logId);
  }

  @Get('my')
  getMyNotifications() {
    return this.notificationsService.getMyNotifications();
  }
}
