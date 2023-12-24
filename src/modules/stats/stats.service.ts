import { Injectable } from '@nestjs/common';
import { TicketsService } from '../tickets/tickets.service';
import { oneMonthAgo, oneWeekAgo, oneYearAgo } from '@/utils/time';
import { TICKET_STATUS } from '../tickets/entities';
import { ROLES, User } from '../users/entities';
import { TasksService } from '../tasks/tasks.service';
import { CommentsService } from '../comments/comments.service';
import { VotesService } from '../comments/vote.service';
import { UsersService } from '../users/users.service';
import { AreasService } from '../areas/areas.service';

@Injectable()
export class StatsService {
  constructor(
    private readonly ticketService: TicketsService,
    private readonly taskService: TasksService,
    private readonly commentService: CommentsService,
    private readonly voteService: VotesService,
    private readonly userService: UsersService,
    private readonly areaService: AreasService,
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
          evidences: {
            $exists: true,
            $ne: [],
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

  async admin(user: User) {
    try {
      const [
        totalReport,
        totalUser,
        totalVolunteer,
        totalArea,
        summaryReport,
        reportPerMonth,
      ] = await Promise.all([
        this.ticketService.count({
          ...(user.role === ROLES.AreaManager ? { area: user.area._id } : {}),
        }),
        this.userService.count({
          role: ROLES.User,
        }),
        this.userService.count({
          role: ROLES.Volunteer,
          ...(user.role === ROLES.AreaManager ? { area: user.area._id } : {}),
        }),
        this.areaService.count({}),
        this.ticketService.aggregate([
          {
            $match: {
              ...(user.role === ROLES.AreaManager ? { area: user.area._id } : {}),
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
        this.ticketService.aggregate([
          {
            $match: {
              created_at: {
                $gte: oneYearAgo(),
              },
              ...(user.role === ROLES.AreaManager ? { area: user.area._id } : {}),
            },
          },
          {
            $group: {
              _id: {
                month: {
                  $month: '$created_at',
                },
              },
              count: {
                $sum: 1,
              },
            },
          },
        ]),
      ]);
      return {
        total_report: totalReport,
        total_user: totalUser,
        total_volunteer: totalVolunteer,
        total_area: totalArea,
        summary_report: summaryReport,
        report_per_month: reportPerMonth,
      };
    } catch (error) {
      throw error;
    }
  }
}
