import { ResponseIdSerialization } from '@/common/serializations';
import { PostCategoryGetSerialization } from './post-category.get.serialization';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostGetSerialization extends ResponseIdSerialization {
  @ApiPropertyOptional()
  @Type(() => PostCategoryGetSerialization)
  category: PostCategoryGetSerialization;
}
