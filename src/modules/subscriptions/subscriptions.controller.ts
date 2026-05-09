import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('my')
  getMySubscription() {
    return this.subscriptionsService.getMySubscription();
  }

  @Get('trial-status')
  getTrialStatus() {
    return this.subscriptionsService.getTrialStatus();
  }

  @Post('activate')
  activate(@Body() data: any) {
    return this.subscriptionsService.activate(data);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.subscriptionsService.updateStatus(id, status);
  }
}
