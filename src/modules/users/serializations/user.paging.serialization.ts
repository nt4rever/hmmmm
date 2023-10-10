import { ResponsePagingSerialization } from '@common/serializations';
import { UserGetSerialization } from './user.get.serialization';
import { Type } from 'class-transformer';

export class UserPagingSerialization extends ResponsePagingSerialization {
  @Type(() => UserGetSerialization)
  items: UserGetSerialization[];
}
