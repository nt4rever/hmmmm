import { CreateVolunteerDto } from '@modules/volunteers/dto';
import { OmitType } from '@nestjs/swagger';

export class CreateManagerDto extends OmitType(CreateVolunteerDto, [
  'lat',
  'lng',
  'radius',
]) {}
