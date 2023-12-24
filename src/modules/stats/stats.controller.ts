import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetTicketStatsDto } from './dto';
import { StatsService } from './stats.service';
import { JwtAccessTokenGuard, RolesGuard } from '../auth/guards';
import { Public } from '@/decorators/auth.decorator';
import { RequestWithUser } from '@/common/types';
import { Roles } from '@/decorators/roles.decorator';
import { ROLES } from '../users/entities';

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

  @Roles(ROLES.Admin, ROLES.AreaManager)
  @UseGuards(RolesGuard)
  @Get('/admin')
  async admin(@Req() { user }: RequestWithUser) {
    return await this.statsService.admin(user);
  }
}
