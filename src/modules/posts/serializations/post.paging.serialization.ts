import { ResponsePagingSerialization } from '@/common/serializations';
import { PostGetSerialization } from './post.get.serialization';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PostPagingSerialization extends ResponsePagingSerialization {
  @Type(() => PostGetSerialization)
  @ApiProperty({
    type: PostGetSerialization,
    isArray: true,
  })
  items: PostGetSerialization[];
}
