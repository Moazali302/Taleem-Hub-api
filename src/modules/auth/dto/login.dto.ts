import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email must be at most 255 characters' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(1, { message: 'Password is required' })
  password: string;
  
 @ApiPropertyOptional({
  description: 'Unique school identifier. Not required for superadmin.',
})
@IsOptional()
@IsString({ message: 'School ID must be a string' })
@MaxLength(255, { message: 'School ID must be at most 255 characters' })
schoolId?: string;
}
