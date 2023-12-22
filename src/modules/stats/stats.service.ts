import { Injectable } from '@nestjs/common';
import { TicketsService } from '../tickets/tickets.service';
import { oneMonthAgo, oneWeekAgo } from '@/utils/time';
import { TICKET_STATUS } from '../tickets/entities';
import { User } from '../users/entities';
import { TasksService } from '../tasks/tasks.service';
import { CommentsService } from '../comments/comments.service';
import { VotesService } from '../comments/vote.service';

@Injectable()
export class StatsService {
  constructor(
    private readonly ticketService: TicketsService,
    private readonly taskService: TasksService,
    private readonly commentService: CommentsService,
    private readonly voteService: VotesService,
  ) {}

  async ticketStats(areaId?: string) {
    try {
      const [
        numOfReportsInPastWeek,
        numOfReportsFixedInPastMonth,
        numOfReportsHasBeenVerified,
      ] = await Promise.all([
        this.ticketService.count({
          created_at: {
            $gte: oneWeekAgo(),
            $lt: new Date(),
          },
          ...(areaId ? { area: areaId } : {}),
        }),
        this.ticketService.count({
          created_at: {
            $gte: oneMonthAgo(),
            $lt: new Date(),
          },
          status: TICKET_STATUS.RESOLVED,
          ...(areaId ? { area: areaId } : {}),
        }),
        this.ticketService.count({
          status: {
            $in: [TICKET_STATUS.REJECTED, TICKET_STATUS.CONFIRMED],
          },
          ...(areaId ? { area: areaId } : {}),
        }),
      ]);
      return {
        in_past_week: numOfReportsInPastWeek,
        fixed_in_past_month: numOfReportsFixedInPastMonth,
        has_been_verified: numOfReportsHasBeenVerified,
      };
    } catch (error) {
      throw error;
    }
  }

  async personal(user: User) {
    try {
      const [
        totalReport,
        totalTask,
        totalComment,
        totalVote,
        summaryReport,
        summaryTask,
      ] = await Promise.all([
        this.ticketService.count({
          created_by: user,
        }),
        this.taskService.count({
          assignee: user,
        }),
        this.commentService.count({
          created_by: user,
        }),
        this.voteService.count({
          created_by: user,
        }),
        this.ticketService.aggregate([
          {
            $match: {
              created_by: user._id,
            },
          },
          {
            $group: {
              _id: { status: '$status' },
              count: {
                $sum: 1,
              },
            },
          },
        ]),
        this.taskService.aggregate([
          {
            $match: {
              assignee: user._id,
            },
          },
          {
            $group: {
              _id: { status: '$status' },
              count: {
                $sum: 1,
              },
            },
          },
        ]),
      ]);
      return {
        total_report: totalReport,
        total_task: totalTask,
        total_comment: totalComment,
        total_vote: totalVote,
        summary_report: summaryReport,
        summary_task: summaryTask,
      };
    } catch (error) {
      throw error;
    }
  }
}
