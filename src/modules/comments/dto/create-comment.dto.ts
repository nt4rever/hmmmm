import { IsMongoId, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsMongoId()
  ticket: string;

  @IsNotEmpty()
  @MaxLength(500)
  content: string;
}
