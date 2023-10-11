import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { CreateVolunteerDto } from './create-volunteer.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateVolunteerDto extends PartialType(
  PickType(CreateVolunteerDto, ['lat', 'lng', 'radius']),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
