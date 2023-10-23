import { ResponseIdSerialization } from '@/common/serializations';
import { Area } from '@/modules/areas/entities';
import { AreaGetSerialization } from '@/modules/areas/serializations';
import { User } from '@/modules/users/entities';
import { UserGetSerialization } from '@/modules/users/serializations';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TICKET_STATUS } from '../entities';

class CreatedBySerialization extends PickType(UserGetSerialization, [
  'first_name',
  'last_name',
]) {}

export class TicketGetSerialization extends ResponseIdSerialization {
  @Type(() => AreaGetSerialization)
  @ApiProperty({
    type: AreaGetSerialization,
  })
  area: Area;

  @Type(() => CreatedBySerialization)
  @ApiProperty({
    type: CreatedBySerialization,
  })
  created_by: User;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  images: string[];

  @ApiProperty({
    type: String,
    enum: TICKET_STATUS,
  })
  status: TICKET_STATUS;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiPropertyOptional()
  close_message?: string;

  @ApiPropertyOptional()
  resolve_message?: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  view_count: number;

  @ApiPropertyOptional()
  severity_level?: string;
}
