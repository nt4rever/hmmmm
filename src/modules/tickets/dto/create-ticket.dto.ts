import {
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsMongoId()
  area_id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsLongitude()
  lng: number;
}
