import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from '../../database/entities/school.entity';
import { User } from '../../database/entities/user.entity';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';

@Module({
  imports: [TypeOrmModule.forFeature([School, User])],
  controllers: [SchoolsController],
  providers: [SchoolsService],
})
export class SchoolsModule {}