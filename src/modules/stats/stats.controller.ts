import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetTicketStatsDto } from './dto';
import { StatsService } from './stats.service';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('/tickets')
  async get(@Query() dto: GetTicketStatsDto) {
    return await this.statsService.ticketStats(dto.areaId);
  }
}
