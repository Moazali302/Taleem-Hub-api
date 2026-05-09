import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('complaints')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Get()
  findAll() {
    return this.complaintsService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.complaintsService.create(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.complaintsService.updateStatus(id, status);
  }

  @Patch(':id/note')
  addNote(@Param('id') id: string, @Body('note') note: string) {
    return this.complaintsService.addNote(id, note);
  }
}
