import { BaseRepositoryInterface } from '@/repositories/base';
import { Vote } from '../entities';
import { Comment } from '../entities/comment.entity';

export interface CommentsRepositoryInterface extends BaseRepositoryInterface<Comment> {
  addVotedBy(id: string, vote: Vote): Promise<Comment>;
  removeVotedBy(id: string, vote: Vote): Promise<Comment>;
}
