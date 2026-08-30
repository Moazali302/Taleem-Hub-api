import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Server hosting' })
  @IsString({ message: 'Category must be a string' })
  @IsNotEmpty({ message: 'Category is required' })
  @MaxLength(100)
  category: string;

  @ApiProperty({ example: 15000 })
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be greater than zero' })
  amount: number;

  @ApiPropertyOptional({ example: 'AWS invoice for August' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @ApiProperty({ example: '2026-08-25' })
  @IsDateString({}, { message: 'Expense date must be a valid date' })
  expenseDate: string;

  @ApiPropertyOptional({
    description: 'Leave empty for a platform-wide expense not tied to one school',
  })
  @IsOptional()
  @IsInt()
  schoolId?: number;
}