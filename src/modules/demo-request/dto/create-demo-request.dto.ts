import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';
import { PAKISTAN_PHONE_REGEX } from '../../../common/constants/auth.constants';

export class CreateDemoRequestDto {
  @ApiProperty({ example: 'Ahmed Khan' })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(255)
  fullName: string;

  @ApiProperty({ example: 'Green Valley School' })
  @IsString({ message: 'School name must be a string' })
  @IsNotEmpty({ message: 'School name is required' })
  @MaxLength(255)
  schoolName: string;

  @ApiProperty({ example: 'ahmed@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: '+923001234567' })
  @Matches(PAKISTAN_PHONE_REGEX, {
    message: 'Phone must be a valid Pakistan number, e.g. +923001234567',
  })
  phone: string;

  @ApiPropertyOptional({ example: 'Interested in the Premium plan' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}