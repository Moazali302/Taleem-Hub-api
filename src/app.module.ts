/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
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
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'login',
        ttl: 15 * 60 * 1000, // 15 min
        limit: 5,
      },
      {
        name: 'resendOtp',
        ttl: 5 * 60 * 1000, // 5 min
        limit: 5,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'src/.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // Keep schema changes explicit via migrations; auto-sync can drop/rename columns unexpectedly.
        type: 'postgres' as const,
        host: config.getOrThrow<string>('DATABASE_HOST'),
        port: parseInt(config.getOrThrow<string>('DATABASE_PORT'), 10),
        username: config.getOrThrow<string>('DATABASE_USER'),
        password: config.getOrThrow<string>('DATABASE_PASS'),
        database: config.getOrThrow<string>('DATABASE_NAME'),
        ssl: {
          rejectUnauthorized: false,
        },
        extra: {
          max: 10,
          idleTimeoutMillis: 10000,
          connectionTimeoutMillis: 3000,
        },
        poolSize: 10,
        connectTimeoutMS: 3000,
        entities: [
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
        ],
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
        migrationsRun:
          config.get<string>('DB_MIGRATIONS_RUN', 'false') === 'true',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    MailModule,
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
