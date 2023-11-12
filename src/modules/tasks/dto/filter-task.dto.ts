import { ApiPropertyOptional } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class FilterTaskDto {
  @ApiPropertyOptional()
  @Allow()
  status?: string;
}
