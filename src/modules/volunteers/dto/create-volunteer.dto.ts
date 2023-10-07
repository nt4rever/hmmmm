import { CreateUserDto } from '@modules/users/dto';
import { OmitType } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class CreateVolunteerDto extends OmitType(CreateUserDto, ['role']) {
  @IsNotEmpty()
  @IsMongoId()
  area_id: string;

  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsLongitude()
  lng: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10 * 1000) // R <= 10km
  radius: number = 1000; // Default R=1km
}
