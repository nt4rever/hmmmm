import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @MaxLength(1000)
  address: string;
}
