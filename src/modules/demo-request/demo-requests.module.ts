import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoRequestsController } from './demo-requests.controller';
import { DemoRequestsService } from './demo-requests.service';
import { DemoRequest } from '../../database/entities/demo-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DemoRequest])],
  controllers: [DemoRequestsController],
  providers: [DemoRequestsService],
  exports: [DemoRequestsService],
})
export class DemoRequestsModule {}