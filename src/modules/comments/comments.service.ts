import { BaseServiceAbstract } from '@/services/base';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../users/entities';
import { Comment } from './entities';
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

  async addVotedBy(id: string, user: User, isUpVote: boolean) {
    try {
      const vote = await this.votesRepository.create({
        created_by: user,
        is_up_vote: isUpVote,
      });
      await this.commentsRepository.addVotedBy(id, vote);
    } catch (error) {
      throw error;
    }
  }

  async updateVote(id: string, isUpVote: boolean) {
    try {
      await this.votesRepository.update(id, {
        is_up_vote: isUpVote,
      });
    } catch (error) {
      throw error;
    }
  }
}
