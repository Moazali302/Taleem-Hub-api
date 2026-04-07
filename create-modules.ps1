$modules = @{
    'teachers' = @{
        'controller' = @'
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('teachers')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  findAll() {
    return this.teachersService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.teachersService.create(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.teachersService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachersService.remove(id);
  }

  @Post(':id/resend-invite')
  resendInvite(@Param('id') id: string) {
    return this.teachersService.resendInvite(id);
  }
}
'@
        'service' = @'
import { Injectable } from '@nestjs/common';

@Injectable()
export class TeachersService {
  findAll() { return { message: 'Get all teachers' }; }
  create(data: any) { return { message: 'Create teacher', data }; }
  findOne(id: string) { return { message: 'Get teacher', id }; }
  update(id: string, data: any) { return { message: 'Update teacher', id, data }; }
  remove(id: string) { return { message: 'Delete teacher', id }; }
  resendInvite(id: string) { return { message: 'Resend invite', id }; }
}
'@
        'module' = @'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { User } from '../../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
'@
    }
}

$modules.GetEnumerator() | ForEach-Object {
    $moduleName = $_.Key
    $files = $_.Value
    
    $files.GetEnumerator() | ForEach-Object {
        $fileType = $_.Key
        $content = $_.Value
        
        $filePath = switch ($fileType) {
            'controller' { "d:\Taleem-hub-api\Taleem-Hub-api\src\modules\$moduleName\$moduleName.controller.ts" }
            'service' { "d:\Taleem-hub-api\Taleem-Hub-api\src\modules\$moduleName\$moduleName.service.ts" }
            'module' { "d:\Taleem-hub-api\Taleem-Hub-api\src\modules\$moduleName\$moduleName.module.ts" }
        }
        
        [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Created: $filePath"
    }
}
