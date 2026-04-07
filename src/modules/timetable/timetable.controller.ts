import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('timetable')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.timetableService.findByTeacher(teacherId);
  }

  @Get('class/:classId')
  findByClass(@Param('classId') classId: string) {
    return this.timetableService.findByClass(classId);
  }

  @Post()
  create(@Body() data: any) {
    return this.timetableService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.timetableService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timetableService.remove(id);
  }
}
