import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @MaxLength(200)
  address: string;

  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsLongitude()
  lng: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000 * 100) // R <= 100km
  radius: number = 1000;
}
