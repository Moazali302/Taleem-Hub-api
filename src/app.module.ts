import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { ClassesModule } from './modules/classes/classes.module';
import { TimetableModule } from './modules/timetable/timetable.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { FeesModule } from './modules/fees/fees.module';
import { ExamsModule } from './modules/exams/exams.module';
import { ResultsModule } from './modules/results/results.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { LeavesModule } from './modules/leaves/leaves.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';

// Entities
import { School } from './database/entities/school.entity';
import { User } from './database/entities/user.entity';
import { Student } from './database/entities/student.entity';
import { Class } from './database/entities/class.entity';
import { Timetable } from './database/entities/timetable.entity';
import { StudentAttendance } from './database/entities/student-attendance.entity';
import { TeacherAttendance } from './database/entities/teacher-attendance.entity';
import { Fee } from './database/entities/fee.entity';
import { Exam } from './database/entities/exam.entity';
import { Result } from './database/entities/result.entity';
import { Complaint } from './database/entities/complaint.entity';
import { LeaveRequest } from './database/entities/leave-request.entity';
import { Announcement } from './database/entities/announcement.entity';
import { Subscription } from './database/entities/subscription.entity';
import { AuditLog } from './database/entities/audit-log.entity';
import { NotificationLog } from './database/entities/notification-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    TypeOrmModule.forFeature([
      School,
      User,
      Student,
      Class,
      Timetable,
      StudentAttendance,
      TeacherAttendance,
      Fee,
      Exam,
      Result,
      Complaint,
      LeaveRequest,
      Announcement,
      Subscription,
      AuditLog,
      NotificationLog,
    ]),
    AuthModule,
    SchoolsModule,
    StudentsModule,
    TeachersModule,
    ClassesModule,
    TimetableModule,
    AttendanceModule,
    FeesModule,
    ExamsModule,
    ResultsModule,
    ComplaintsModule,
    LeavesModule,
    AnnouncementsModule,
    NotificationsModule,
    SubscriptionsModule,
    SuperAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
