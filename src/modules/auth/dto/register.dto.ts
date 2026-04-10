import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PAKISTAN_PHONE_REGEX } from '../../../common/constants/auth.constants';

export class RegisterDto {
  @ApiProperty({ example: 'Green Valley School' })
  @IsString({ message: 'School name must be a string' })
  @IsNotEmpty({ message: 'School name is required' })
  @MaxLength(255, { message: 'School name must be at most 255 characters' })
  schoolName: string;

  @ApiProperty({ example: 'Ahmed Khan' })
  @IsString({ message: 'Owner name must be a string' })
  @IsNotEmpty({ message: 'Owner name is required' })
  @MaxLength(255, { message: 'Owner name must be at most 255 characters' })
  ownerName: string;

  @ApiProperty({ example: 'Street 12, Karachi' })
  @IsString({ message: 'School address must be a string' })
  @IsNotEmpty({ message: 'School address is required' })
  @MaxLength(500, { message: 'School address must be at most 500 characters' })
  schoolAddress: string;

  @ApiProperty({ example: '+923001234567' })
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(PAKISTAN_PHONE_REGEX, {
    message:
      'Phone must be in Pakistan format: +92 followed by exactly 10 digits',
  })
  phone: string;

  @ApiProperty({ example: 'admin@school.edu.pk' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email must be at most 255 characters' })
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}
