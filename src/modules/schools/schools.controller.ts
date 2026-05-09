import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('school')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get('settings')
  getSettings() {
    return this.schoolsService.getSettings();
  }

  @Patch('settings')
  updateSettings(@Body() data: any) {
    return this.schoolsService.updateSettings(data);
  }

  @Post('settings/logo')
  @UseInterceptors(FileInterceptor('logo'))
  uploadLogo(@UploadedFile() file: Express.Multer.File) {
    return this.schoolsService.uploadLogo(file);
  }

  @Delete('settings/logo')
  deleteLogo() {
    return this.schoolsService.deleteLogo();
  }

  @Get('settings/location')
  getLocation() {
    return this.schoolsService.getLocation();
  }

  @Patch('settings/location')
  updateLocation(@Body() location: any) {
    return this.schoolsService.updateLocation(location);
  }
}
