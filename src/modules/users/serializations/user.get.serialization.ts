import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { GENDER, ROLES, RefreshToken, VotePerDay } from '../entities';
import { ResponseIdSerialization } from '@/common/serializations';
import { getAvatarUrl } from '@/utils/getAvatarUrl';
import { Location } from '@/modules/shared/base';
import { TicketPerDay } from '../entities/ticket-per-day.entity';

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

  @ApiPropertyOptional()
  @Type(() => TicketPerDay)
  ticket_per_day?: TicketPerDay;

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
