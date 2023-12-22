import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class GetTicketStatsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  areaId?: string;
}
