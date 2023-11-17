import { ResponseIdSerialization } from '@/common/serializations';
import { User } from '@/modules/users/entities';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EVIDENCE_TYPE } from '../entities';
import { CreatedBySerialization } from './ticket.get.serialization';

export class EvidenceGetSerialization extends ResponseIdSerialization {
  @Type(() => CreatedBySerialization)
  @ApiProperty({
    type: CreatedBySerialization,
  })
  created_by: User;

  @ApiPropertyOptional()
  content?: string;

  @ApiProperty()
  images: string[];

  @ApiProperty({
    type: String,
    enum: EVIDENCE_TYPE,
  })
  type: EVIDENCE_TYPE;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;
}
