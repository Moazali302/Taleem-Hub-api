import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

const PACKAGE_PLANS = ['basic', 'advanced', 'premium'] as const;

export class UpdatePackageDto {
  @ApiProperty({ enum: PACKAGE_PLANS })
  @IsNotEmpty({ message: 'Plan is required' })
  @IsIn(PACKAGE_PLANS, {
    message: `Plan must be one of: ${PACKAGE_PLANS.join(', ')}`,
  })
  plan: (typeof PACKAGE_PLANS)[number];
}