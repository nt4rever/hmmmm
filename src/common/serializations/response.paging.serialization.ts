import { ApiProperty } from '@nestjs/swagger';
import { PageMeta } from './../../types/common.type';

export class ResponsePagingSerialization {
  @ApiProperty()
  meta: PageMeta;
}
