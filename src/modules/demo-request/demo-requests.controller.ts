import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DemoRequestsService } from './demo-requests.service';
import { CreateDemoRequestDto } from './dto/create-demo-request.dto';
import { UpdateDemoRequestStatusDto } from './dto/update-demo-request-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('demo-requests')
export class DemoRequestsController {
  constructor(private readonly demoRequestsService: DemoRequestsService) {}

  // Public endpoint — hit by the marketing website's "Request a demo" form.
  // Intentionally has no guards: the submitter is not yet a Taleem Hub user.
  @Post()
  create(@Body() dto: CreateDemoRequestDto) {
    return this.demoRequestsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  findAll(@Query('status') status?: string) {
    return this.demoRequestsService.findAll(status);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDemoRequestStatusDto,
  ) {
    return this.demoRequestsService.updateStatus(id, dto);
  }
}