import { IsNotEmpty, IsNumber, Max, MaxLength, Min } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @MaxLength(1000)
  address: string;

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
  @Max(1000 * 100) // R <= 100km
  radius: number = 1000;
}
