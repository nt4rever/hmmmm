import { Injectable } from '@nestjs/common';
import { TicketsService } from '../tickets/tickets.service';
import { oneMonthAgo, oneWeekAgo } from '@/utils/time';
import { TICKET_STATUS } from '../tickets/entities';

@Injectable()
export class StatsService {
  constructor(private readonly ticketService: TicketsService) {}

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
}
