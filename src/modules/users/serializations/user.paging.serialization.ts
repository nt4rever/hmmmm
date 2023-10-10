import { ResponsePagingSerialization } from '@common/serializations';
import { Type } from 'class-transformer';
import { UserGetSerialization } from './user.get.serialization';
import { ApiProperty } from '@nestjs/swagger';

export class UserPagingSerialization extends ResponsePagingSerialization {
  @Type(() => UserGetSerialization)
  @ApiProperty({
    type: UserGetSerialization,
  })
  items: UserGetSerialization[];
}
