import { ResponsePagingSerialization } from '@/common/serializations';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StaticPageGetSerialization } from './static-page.get.serialization';

export class StaticPagePagingSerialization extends ResponsePagingSerialization {
  @Type(() => StaticPageGetSerialization)
  @ApiProperty({
    type: StaticPageGetSerialization,
    isArray: true,
  })
  items: StaticPageGetSerialization[];
}
