import { IsBoolean, IsNotEmpty } from 'class-validator';

export class VoteCommentDto {
  @IsNotEmpty()
  @IsBoolean()
  upVote: boolean;
}
