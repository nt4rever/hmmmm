import { BaseServiceAbstract } from '@/services/base';
import { Inject, Injectable } from '@nestjs/common';
import { Comment } from './entities';
import { CommentsRepositoryInterface } from './interfaces';

@Injectable()
export class CommentsService extends BaseServiceAbstract<Comment> {
  constructor(
    @Inject('CommentsRepositoryInterface')
    private readonly commentsRepository: CommentsRepositoryInterface,
  ) {
    super(commentsRepository);
  }
}
