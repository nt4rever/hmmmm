import { ApiPropertyOptional } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class FilterTicketDto {
  @ApiPropertyOptional()
  @Allow()
  area?: string;

  @ApiPropertyOptional()
  @Allow()
  status?: string;

  @ApiPropertyOptional()
  @Allow()
  created_by?: string;
}
