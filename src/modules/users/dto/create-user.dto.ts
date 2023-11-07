import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GENDER, ROLES } from '../entities';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsOptional()
  @MaxLength(50)
  first_name?: string;

  @IsNotEmpty()
  @MaxLength(50)
  last_name: string;

  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  @ApiProperty({
    example: 'user.001@hmmmm.tech',
  })
  email: string;

  @IsOptional()
  @MaxLength(15)
  phone_number?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: Date;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsOptional()
  @IsEnum(GENDER)
  gender?: GENDER;

  @IsOptional()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsEnum(ROLES)
  role?: ROLES;
}
