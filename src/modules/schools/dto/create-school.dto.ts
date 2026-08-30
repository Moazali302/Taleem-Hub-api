import { IsString, IsEmail, Matches, MinLength, MaxLength } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  school_name: string;

  @IsString()
  @MinLength(5)
  @MaxLength(500)
  school_address: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  owner_name: string;

  @Matches(/^\+92[0-9]{10}$/, { message: 'Invalid phone number format' })
  owner_number: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must include uppercase, lowercase, and a number',
  })
  password: string;
}