import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  old_password: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  new_password: string;
}
