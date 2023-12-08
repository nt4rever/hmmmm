import { BaseServiceAbstract } from '@/services/base';
import { Inject, Injectable } from '@nestjs/common';
import { Comment, Vote } from './entities';
import { CommentsRepositoryInterface, VotesRepositoryInterface } from './interfaces';

@Injectable()
export class CommentsService extends BaseServiceAbstract<Comment> {
  constructor(
    @Inject('CommentsRepositoryInterface')
    private readonly commentsRepository: CommentsRepositoryInterface,
    @Inject('VotesRepositoryInterface')
    private readonly votesRepository: VotesRepositoryInterface,
  ) {
    super(commentsRepository);
  }

  async addVotedBy(id: string, vote: Vote) {
    try {
      await this.commentsRepository.addVotedBy(id, vote);
    } catch (error) {
      throw error;
    }
  }

  async removeVotedBy(id: string, vote: Vote) {
    try {
      await this.commentsRepository.removeVotedBy(id, vote);
    } catch (error) {
      throw error;
    }
  }
}
