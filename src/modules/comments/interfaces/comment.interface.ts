import { BaseRepositoryInterface } from '@/repositories/base';
import { Comment } from '../entities/comment.entity';
import { User } from '@/modules/users/entities';

export interface CommentsRepositoryInterface extends BaseRepositoryInterface<Comment> {
  addVotedBy(id: string, user: User): Promise<Comment>;
}
