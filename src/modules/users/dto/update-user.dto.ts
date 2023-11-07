import { IsDateString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { GENDER } from '../entities';

export class UpdateUserDto {
  @IsOptional()
  @MaxLength(50)
  first_name?: string;

  @IsOptional()
  @MaxLength(50)
  last_name?: string;

  @IsOptional()
  @MaxLength(15)
  phone_number?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: Date;

  @IsOptional()
  @IsEnum(GENDER)
  gender?: GENDER;

  @IsOptional()
  @MaxLength(200)
  address?: string;
}
