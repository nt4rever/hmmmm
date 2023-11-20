import { UserGetSerialization } from '@/modules/users/serializations';
import { PickType } from '@nestjs/swagger';

export class VolunteerGetSerialization extends PickType(UserGetSerialization, [
  'id',
  'first_name',
  'last_name',
  'email',
  'avatar',
]) {}
