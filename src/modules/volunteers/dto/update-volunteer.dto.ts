import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { CreateVolunteerDto } from './create-volunteer.dto';
import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateVolunteerDto extends PartialType(
  PickType(CreateVolunteerDto, ['lat', 'lng']),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000 * 100) // R <= 100km
  radius?: number;
}
