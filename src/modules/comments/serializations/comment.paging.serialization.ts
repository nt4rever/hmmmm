import { ResponsePagingSerialization } from '@/common/serializations';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CommentGetSerialization } from './comment.get.serialization';

export class CommentPagingSerialization extends ResponsePagingSerialization {
  @Type(() => CommentGetSerialization)
  @ApiProperty({
    type: CommentGetSerialization,
    isArray: true,
  })
  items: CommentGetSerialization[];
}
