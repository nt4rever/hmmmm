import { EVIDENCE_TYPE } from '@/modules/tickets/entities';
import { IsEnum, IsLatitude, IsLongitude, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateTaskDto {
  @IsNotEmpty()
  @MaxLength(500)
  content: string;

  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsLongitude()
  lng: number;

  @IsNotEmpty()
  @IsEnum(EVIDENCE_TYPE)
  type: EVIDENCE_TYPE;
}
