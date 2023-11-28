import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class GetMapDto {
  @IsNotEmpty()
  @IsLatitude()
  @Type(() => Number)
  neLat: number;

  @IsNotEmpty()
  @IsLongitude()
  @Type(() => Number)
  neLng: number;

  @IsNotEmpty()
  @IsLatitude()
  @Type(() => Number)
  swLat: number;

  @IsNotEmpty()
  @IsLongitude()
  @Type(() => Number)
  swLng: number;
}
