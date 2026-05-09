import { Controller, Get, Post, Body, Param, Patch, UseGuards, Res } from '@nestjs/common';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import type { Response } from 'express';

@Controller('results')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get('class/:classId')
  findByClass(@Param('classId') classId: string) {
    return this.resultsService.findByClass(classId);
  }

  @Post()
  create(@Body() data: any) {
    return this.resultsService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.resultsService.update(id, data);
  }

  @Patch('lock/:examId')
  lockResults(@Param('examId') examId: string) {
    return this.resultsService.lockResults(examId);
  }

  @Patch('unlock/:examId')
  unlockResults(@Param('examId') examId: string) {
    return this.resultsService.unlockResults(examId);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.resultsService.findByStudent(studentId);
  }

  @Get('student/:studentId/pdf')
  generateStudentResultPdf(@Param('studentId') studentId: string, @Res() res: Response) {
    return this.resultsService.generateStudentResultPdf(studentId, res);
  }
}
