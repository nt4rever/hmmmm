import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { GENDER, ROLES, RefreshToken, VotePerDay } from '../entities';
import { ResponseIdSerialization } from '@/common/serializations';
import { getAvatarUrl } from '@/utils/getAvatarUrl';
import { Location } from '@/modules/shared/base';

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
  @Type(() => VotePerDay)
  vote_per_day?: VotePerDay;

  @Exclude()
  @ApiHideProperty()
  password?: string;

  @Exclude()
  @ApiHideProperty()
  refresh_token: RefreshToken[];

  @ApiPropertyOptional()
  @Expose()
  @Transform((value) => value.obj?.area?.toString(), { toClassOnly: true })
  area?: string;

  @ApiPropertyOptional()
  @Type(() => Location)
  location?: Location;
}
