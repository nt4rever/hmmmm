import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateUserAreaDto {
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  area: string;

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
  @Max(1000 * 10) // R <= 10km
  radius: number = 1000;
}
