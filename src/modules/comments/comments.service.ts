import { BaseServiceAbstract } from '@/services/base';
import { Inject, Injectable } from '@nestjs/common';
import { Comment } from './entities';
import { CommentsRepositoryInterface } from './interfaces';
import { User } from '../users/entities';

@Injectable()
export class CommentsService extends BaseServiceAbstract<Comment> {
  constructor(
    @Inject('CommentsRepositoryInterface')
    private readonly commentsRepository: CommentsRepositoryInterface,
  ) {
    super(commentsRepository);
  }

  async addVotedBy(id: string, user: User) {
    try {
      await this.commentsRepository.addVotedBy(id, user);
    } catch (error) {
      throw error;
    }
  }
}
