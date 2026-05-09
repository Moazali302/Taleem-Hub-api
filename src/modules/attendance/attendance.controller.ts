import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('student')
  markStudentAttendance(@Body() data: any) {
    return this.attendanceService.markStudentAttendance(data);
  }

  @Patch('student/:id')
  updateStudentAttendance(@Param('id') id: string, @Body() data: any) {
    return this.attendanceService.updateStudentAttendance(id, data);
  }

  @Get('student/class/:classId')
  getStudentAttendanceByClass(@Param('classId') classId: string) {
    return this.attendanceService.getStudentAttendanceByClass(classId);
  }

  @Get('student/:studentId/monthly')
  getMonthlyStudentAttendance(@Param('studentId') studentId: string) {
    return this.attendanceService.getMonthlyStudentAttendance(studentId);
  }

  @Post('teacher')
  markTeacherAttendance(@Body() data: any) {
    return this.attendanceService.markTeacherAttendance(data);
  }

  @Get('teacher')
  getTeacherAttendance() {
    return this.attendanceService.getTeacherAttendance();
  }

  @Get('teacher/all')
  getAllTeacherAttendance() {
    return this.attendanceService.getAllTeacherAttendance();
  }
}
