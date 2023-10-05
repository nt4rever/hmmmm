import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class LocationDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  radius: number = 1000;
}

export class CreateAreaDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @MaxLength(1000)
  address: string;

  @Type(() => LocationDto)
  @ValidateNested()
  location: LocationDto;
}
