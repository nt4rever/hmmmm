import { ResponseIdSerialization } from '@/common/serializations';
import { Area } from '@/modules/areas/entities';
import { AreaGetSerialization } from '@/modules/areas/serializations';
import { User } from '@/modules/users/entities';
import { UserGetSerialization } from '@/modules/users/serializations';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  PickType,
} from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { TICKET_STATUS } from '../entities';

export class CreatedBySerialization extends PickType(UserGetSerialization, [
  'first_name',
  'last_name',
  'role',
  'avatar',
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

  @Exclude()
  @ApiHideProperty()
  voted_by: any;

  @ApiPropertyOptional({
    properties: {
      is_up_vote: {
        type: 'boolean',
      },
    },
  })
  @Expose()
  @Transform(
    (value) => {
      if (value.obj?.voted_by?.length > 0) {
        return {
          is_up_vote: value.obj?.voted_by[0].is_up_vote,
        };
      }
      return null;
    },
    { toClassOnly: true },
  )
  voted_by_me: any;
}
