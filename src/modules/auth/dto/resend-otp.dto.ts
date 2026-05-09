import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;


  @ApiProperty({ example: 'reset', required: false })
  @IsString()
  @IsOptional()
  mode?: string; // 
}