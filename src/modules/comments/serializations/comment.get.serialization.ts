import { ResponseIdSerialization } from '@/common/serializations';
import { CreatedBySerialization } from '@/modules/tickets/serializations/ticket.get.serialization';
import { User } from '@/modules/users/entities';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class CommentGetSerialization extends ResponseIdSerialization {
  @ApiProperty()
  content: string;

  @ApiProperty()
  score: number;

  @Type(() => CreatedBySerialization)
  @ApiProperty({
    type: CreatedBySerialization,
  })
  created_by: User;

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
