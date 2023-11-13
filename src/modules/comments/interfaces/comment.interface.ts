import { BaseRepositoryInterface } from '@/repositories/base';
import { Comment } from '../entities/comment.entity';

export interface CommentsRepositoryInterface extends BaseRepositoryInterface<Comment> {}
