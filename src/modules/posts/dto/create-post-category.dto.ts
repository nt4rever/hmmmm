import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostCategoryDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
