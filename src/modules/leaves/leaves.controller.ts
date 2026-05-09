import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('leaves')
@UseGuards(JwtAuthGuard, TenantGuard)
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Get()
  findAll() {
    return this.leavesService.findAll();
  }

  @Post()
  create(@Body() data: any, @CurrentUser() user: any) {
    return this.leavesService.create(data, user);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.leavesService.approve(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.leavesService.reject(id);
  }

  @Patch(':id/note')
  addNote(@Param('id') id: string, @Body('note') note: string) {
    return this.leavesService.addNote(id, note);
  }

  @Get('my')
  getMyLeaves(@CurrentUser() user: any) {
    return this.leavesService.getMyLeaves(user);
  }
}
