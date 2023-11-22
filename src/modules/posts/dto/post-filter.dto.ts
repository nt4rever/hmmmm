import { ApiPropertyOptional } from '@nestjs/swagger';
import { Allow, IsMongoId, IsOptional } from 'class-validator';

export class FilterPostDto {
  @ApiPropertyOptional()
  @Allow()
  @IsOptional()
  @IsMongoId()
  category?: string;
}
