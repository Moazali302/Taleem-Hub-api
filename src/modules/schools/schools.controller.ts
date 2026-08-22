import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SchoolRoleEnum } from '../../common/constants/auth.constants';

@ApiTags('schools')
@ApiBearerAuth()
@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post('create-school')
  @Roles(SchoolRoleEnum.SUPERADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new school (super-admin only)' })
  async create(@Body() dto: CreateSchoolDto) {
    const result = await this.schoolsService.create(dto);
    return {
      success: true,
      message: 'School added successfully',
      data: result,
    };
  }
  @Get()
  @Roles(SchoolRoleEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'list all Schools (super-admin-only)'})
  async findAll(){
    const schools=await this.schoolsService.findAll();
    return{
      success:true,
      message:'Schools fetched Successfully',
      data:schools,
    };
  }
}