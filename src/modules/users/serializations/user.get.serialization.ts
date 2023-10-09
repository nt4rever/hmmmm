import { ResponseIdSerialization } from '@common/serializations';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { GENDER, ROLES, RefreshToken, VotePerDay } from '../entities';
import { getAvatarUrl } from '@utils/getAvatarUrl';

export class UserGetSerialization extends ResponseIdSerialization {
  @ApiPropertyOptional()
  first_name?: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone_number?: string;

  @ApiPropertyOptional()
  @Expose()
  @Transform((value) => getAvatarUrl(value.obj?.avatar), { toClassOnly: true })
  avatar?: string;

  @ApiPropertyOptional()
  date_of_birth?: Date;

  @ApiPropertyOptional()
  gender?: GENDER;

  @ApiPropertyOptional()
  address?: string;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  role: ROLES;

  @ApiPropertyOptional()
  vote_per_day?: VotePerDay;

  @Exclude()
  @ApiHideProperty()
  password?: string;

  @Exclude()
  @ApiHideProperty()
  refresh_token: RefreshToken[];
}
