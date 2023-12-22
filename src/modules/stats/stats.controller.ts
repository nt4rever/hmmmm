import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetTicketStatsDto } from './dto';
import { StatsService } from './stats.service';
import { JwtAccessTokenGuard } from '../auth/guards';
import { Public } from '@/decorators/auth.decorator';
import { RequestWithUser } from '@/common/types';

@ApiTags('stats')
@Controller('stats')
@ApiBearerAuth('token')
@UseGuards(JwtAccessTokenGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Public()
  @Get('/tickets')
  async get(@Query() dto: GetTicketStatsDto) {
    return await this.statsService.ticketStats(dto.areaId);
  }

  @Get('/personal')
  async personal(@Req() { user }: RequestWithUser) {
    return await this.statsService.personal(user);
  }
}
