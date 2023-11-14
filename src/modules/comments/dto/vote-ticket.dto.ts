import { IsBoolean, IsNotEmpty } from 'class-validator';
import { VoteCommentDto } from './vote-comment.dto';

export class VoteTicketDto extends VoteCommentDto {
  @IsNotEmpty()
  @IsBoolean()
  upVote: boolean;
}
