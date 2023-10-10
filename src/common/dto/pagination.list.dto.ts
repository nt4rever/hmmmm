import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationListDto {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  perPage: number;

  @ApiHideProperty()
  limit: number;

  @ApiHideProperty()
  offset: number;
}
