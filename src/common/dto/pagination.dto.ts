import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional()
  @Allow()
  page: number;

  @ApiPropertyOptional()
  @Allow()
  per_page: number;

  @ApiHideProperty()
  @Allow()
  limit: number;

  @ApiHideProperty()
  @Allow()
  offset: number;
}
