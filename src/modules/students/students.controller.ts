import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('students')
@UseGuards(JwtAuthGuard, TenantGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.studentsService.create(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.studentsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }

  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('photo'))
  uploadPhoto(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.studentsService.uploadPhoto(id, file);
  }

  @Get(':id/fee-history')
  getFeeHistory(@Param('id') id: string) {
    return this.studentsService.getFeeHistory(id);
  }

  @Get(':id/attendance')
  getAttendance(@Param('id') id: string) {
    return this.studentsService.getAttendance(id);
  }

  @Post('restore/:id')
  restore(@Param('id') id: string) {
    return this.studentsService.restore(id);
  }
}
