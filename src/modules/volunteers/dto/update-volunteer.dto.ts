import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { CreateVolunteerDto } from './create-volunteer.dto';

export class UpdateVolunteerDto extends PartialType(
  OmitType(CreateVolunteerDto, ['radius', 'email', 'password']),
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
