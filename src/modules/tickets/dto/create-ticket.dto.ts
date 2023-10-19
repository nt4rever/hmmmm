import {
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsMongoId()
  area_id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsLongitude()
  lng: number;
}
