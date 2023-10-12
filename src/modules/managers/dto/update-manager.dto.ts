import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateManagerDto } from './create-manager.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateManagerDto extends PartialType(
  OmitType(CreateManagerDto, ['area_id', 'email', 'password']),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
