import { ApiPropertyOptional } from '@nestjs/swagger';
import { Allow, IsMongoId, IsOptional } from 'class-validator';

export class FilterTicketDto {
  @ApiPropertyOptional()
  @Allow()
  @IsOptional()
  @IsMongoId()
  area?: string;

  @ApiPropertyOptional()
  @Allow()
  status?: string;

  @ApiPropertyOptional()
  @Allow()
  @IsOptional()
  @IsMongoId()
  created_by?: string;
}
