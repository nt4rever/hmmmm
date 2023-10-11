import { CreateUserDto } from '@/modules/users/dto';
import { OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateManagerDto extends OmitType(CreateUserDto, ['role']) {
  @IsNotEmpty()
  @IsMongoId()
  area_id: string;
}
