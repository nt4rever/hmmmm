import { PaginationDto } from '@/common/dto';
import { RequestWithUser } from '@/common/types';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { PagingSerialization } from '@/decorators/api-paging.decorator';
import { Public } from '@/decorators/auth.decorator';
import { PaginationPagingPipe } from '@/pipes/pagination-paging.pipe';
import { ParseMongoIdPipe } from '@/pipes/parse-mongo-id.pipe';
import { ParseOrderPipe } from '@/pipes/parse-order.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/guards';
import { PaginationService } from '../pagination/pagination.service';
import { TicketsService } from '../tickets/tickets.service';
import { UsersService } from '../users/users.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto, FilterCommentDto, VoteCommentDto, VoteTicketDto } from './dto';
import { CommentPagingSerialization } from './serializations';
import { VOTE_TYPE } from './entities';
import { VotesService } from './vote.service';

@Controller('comments')
@ApiTags('comments')
@ApiBearerAuth('token')
@UseGuards(JwtAccessTokenGuard)
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly ticketsService: TicketsService,
    private readonly paginationService: PaginationService,
    private readonly usersService: UsersService,
    private readonly votesService: VotesService,
  ) {}

  @Post()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Body() dto: CreateCommentDto, @Req() { user }: RequestWithUser) {
    const ticket = await this.ticketsService.findOne(dto.ticket);
    if (!ticket) {
      throw new NotFoundException(ERRORS_DICTIONARY.TICKET_NOT_FOUND);
    }
    await this.commentsService.create({
      ...dto,
      created_by: user,
    });
  }

  @Get(':ticketId')
  @Public()
  @PagingSerialization(CommentPagingSerialization)
  @ApiQuery({
    name: 'user',
    type: String,
    required: false,
  })
  async all(
    @Query(PaginationPagingPipe()) { page, per_page, limit, offset }: PaginationDto,
    @Query('order', ParseOrderPipe) order: Record<string, any>,
    @Query() filter: FilterCommentDto,
    @Param('ticketId', ParseMongoIdPipe) ticketId: string,
    @Query('user') user?: string,
  ) {
    const count = await this.commentsService.count({
      ticket: ticketId,
      ...filter,
    });
    const comments = await this.commentsService.findAll(
      {
        ticket: ticketId,
        ...filter,
      },
      {
        join: [
          {
            path: 'created_by',
            select: 'first_name last_name role',
          },
          {
            path: 'voted_by',
            match: {
              created_by: user,
              type: VOTE_TYPE.COMMENT,
            },
            select: {
              created_by: 0,
            },
          },
        ],
        select: {
          ticket: 0,
        },
        paging: {
          limit,
          offset,
        },
        order: {
          ...order,
        },
      },
    );
    return this.paginationService.paginate(
      {
        page,
        per_page,
        count,
      },
      comments,
    );
  }

  @Post(':id/vote-comment')
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async voteComment(
    @Body() dto: VoteCommentDto,
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() { user }: RequestWithUser,
  ) {
    const canVote = await this.usersService.canVote(user);
    if (!canVote) {
      throw new BadRequestException(ERRORS_DICTIONARY.MAX_VOTE_PER_DAY);
    }
    const comment = await this.commentsService.findOne(id, {
      join: {
        path: 'voted_by',
        match: {
          created_by: user,
          type: VOTE_TYPE.COMMENT,
        },
        options: {
          limit: 1,
        },
      },
    });
    if (!comment) {
      throw new NotFoundException(ERRORS_DICTIONARY.COMMENT_NOT_FOUND);
    }
    if (comment.voted_by.length && comment.voted_by[0].is_up_vote === dto.upVote) {
      throw new BadRequestException(ERRORS_DICTIONARY.COMMENT_HAS_VOTED);
    } else if (comment.voted_by.length) {
      await this.votesService.update(comment.voted_by[0].id, {
        is_up_vote: dto.upVote,
      });
      await this.commentsService.update(id, {
        score: comment.score + (dto.upVote ? 2 : -2),
      });
      return;
    }
    const vote = await this.votesService.create({
      created_by: user,
      is_up_vote: dto.upVote,
      type: VOTE_TYPE.COMMENT,
    });

    await this.commentsService.addVotedBy(id, vote);

    await this.commentsService.update(id, {
      score: comment.score + (dto.upVote ? 1 : -1),
    });
  }

  @Post(':id/vote-ticket')
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async voteTicket(
    @Body() dto: VoteTicketDto,
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() { user }: RequestWithUser,
  ) {
    const canVote = await this.usersService.canVote(user);
    if (!canVote) {
      throw new BadRequestException(ERRORS_DICTIONARY.MAX_VOTE_PER_DAY);
    }
    const ticket = await this.ticketsService.findOne(id, {
      join: {
        path: 'voted_by',
        match: {
          created_by: user,
          type: VOTE_TYPE.TICKET,
        },
        options: {
          limit: 1,
        },
      },
    });
    if (!ticket) {
      throw new NotFoundException(ERRORS_DICTIONARY.TICKET_NOT_FOUND);
    }
    if (ticket.voted_by?.length && ticket.voted_by[0].is_up_vote === dto.upVote) {
      throw new BadRequestException(ERRORS_DICTIONARY.TICKET_HAS_VOTED);
    } else if (ticket.voted_by?.length) {
      await this.votesService.update(ticket.voted_by[0].id, {
        is_up_vote: dto.upVote,
      });
      await this.ticketsService.update(ticket.id, {
        score: ticket.score + (dto.upVote ? 2 : -2),
      });
      return;
    }

    const vote = await this.votesService.create({
      created_by: user,
      is_up_vote: dto.upVote,
      type: VOTE_TYPE.TICKET,
    });

    await this.ticketsService.addVotedBy(id, vote);

    await this.ticketsService.update(id, {
      score: ticket.score + (dto.upVote ? 1 : -1),
    });
  }
}
