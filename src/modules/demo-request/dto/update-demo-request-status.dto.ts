import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

const DEMO_REQUEST_STATUSES = [
  'new',
  'contacted',
  'converted',
  'rejected',
] as const;

export class UpdateDemoRequestStatusDto {
  @ApiProperty({ enum: DEMO_REQUEST_STATUSES })
  @IsNotEmpty({ message: 'Status is required' })
  @IsIn(DEMO_REQUEST_STATUSES, {
    message: `Status must be one of: ${DEMO_REQUEST_STATUSES.join(', ')}`,
  })
  status: (typeof DEMO_REQUEST_STATUSES)[number];
}