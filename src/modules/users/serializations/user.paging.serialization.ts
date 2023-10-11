import { ResponsePagingSerialization } from '@/common/serializations';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserGetSerialization } from './user.get.serialization';

export class UserPagingSerialization extends ResponsePagingSerialization {
  @Type(() => UserGetSerialization)
  @ApiProperty({
    type: UserGetSerialization,
  })
  items: UserGetSerialization[];
}
