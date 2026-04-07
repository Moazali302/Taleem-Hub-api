import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { StudentAttendance } from '../../database/entities/student-attendance.entity';
import { TeacherAttendance } from '../../database/entities/teacher-attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentAttendance, TeacherAttendance])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
