import { ResponseIdSerialization } from '@/common/serializations';
import { CreatedBySerialization } from '@/modules/tickets/serializations/ticket.get.serialization';
import { User } from '@/modules/users/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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
}
