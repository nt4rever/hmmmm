import { TicketsService } from '../tickets/tickets.service';
import { User } from '../users/entities';
import { CommentsService } from './comments.service';
import { VOTE_TYPE } from './entities';

export abstract class UnVoteGateway {
  abstract processUnVote(id: string, user: User): Promise<void>;
}

export class UnVoteTicketGateway implements UnVoteGateway {
  constructor(private readonly ticketsService: TicketsService) {}
  async processUnVote(id: string, user: User) {
    const ticket = await this.ticketsService.findOne(id, {
      join: {
        path: 'voted_by',
        match: {
          created_by: user,
          type: VOTE_TYPE.TICKET,
        },
      },
    });
    if (ticket && ticket.voted_by?.length > 0) {
      await this.ticketsService.removeVotedBy(id, ticket.voted_by[0]);
    }
  }
}

export class UnVoteCommentGateway implements UnVoteGateway {
  constructor(private readonly commentsService: CommentsService) {}
  async processUnVote(id: string, user: User) {
    const comment = await this.commentsService.findOne(id, {
      join: {
        path: 'voted_by',
        match: {
          created_by: user,
          type: VOTE_TYPE.COMMENT,
        },
      },
    });
    if (comment && comment.voted_by.length > 0) {
      await this.commentsService.removeVotedBy(id, comment.voted_by[0]);
    }
  }
}
