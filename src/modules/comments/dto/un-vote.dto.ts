import { IsEnum, IsNotEmpty } from 'class-validator';
import { VOTE_TYPE } from '../entities';

export class UnVoteDto {
  @IsNotEmpty()
  @IsEnum(VOTE_TYPE)
  type: VOTE_TYPE;
}
