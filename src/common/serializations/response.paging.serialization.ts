import { ApiProperty } from '@nestjs/swagger';
import { PageMeta } from '../types/common.type';

export class ResponsePagingSerialization {
  @ApiProperty({
    example: {
      page: 1,
      per_page: 20,
      item_count: 3,
      page_count: 1,
      has_next: false,
      has_prev: false,
    },
  })
  meta: PageMeta;
}
