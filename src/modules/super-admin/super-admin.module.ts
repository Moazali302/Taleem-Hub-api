import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { School } from '../../database/entities/school.entity';
import { AuditLog } from '../../database/entities/audit-log.entity';
import { Subscription } from '../../database/entities/subscription.entity';
import { Expense } from '../../database/entities/expense.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([School, AuditLog, Subscription, Expense]),
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
  exports: [SuperAdminService],
})
export class SuperAdminModule {}