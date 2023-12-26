import { ResponseIdSerialization } from '@/common/serializations';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
class StaticPageContentSerialization {
  @ApiProperty()
  lang: string;

  @ApiProperty()
  value: string;
}

export class StaticPageGetSerialization extends ResponseIdSerialization {
  @Type(() => StaticPageContentSerialization)
  @ApiProperty({
    type: StaticPageContentSerialization,
  })
  content: StaticPageContentSerialization;
}
