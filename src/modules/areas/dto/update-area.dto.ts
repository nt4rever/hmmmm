import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAreaDto } from './create-area.dto';
import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateAreaDto extends PartialType(OmitType(CreateAreaDto, ['radius'])) {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000 * 100) // R <= 100km
  radius?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
