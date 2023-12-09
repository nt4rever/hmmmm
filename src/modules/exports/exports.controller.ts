import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { TicketsService } from '../tickets/tickets.service';
import { ExportsService } from './exports.service';
import { Roles } from '@/decorators/roles.decorator';
import { RolesGuard, JwtAccessTokenGuard } from '../auth/guards';
import { ROLES } from '../users/entities';
import { ExportReportDto } from './dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('exports')
@ApiBearerAuth('token')
@Controller('exports')
@Roles(ROLES.AreaManager)
@UseGuards(RolesGuard)
@UseGuards(JwtAccessTokenGuard)
@Throttle({ default: { limit: 10, ttl: 60000 } })
export class ExportsController {
  constructor(
    private readonly exportsService: ExportsService,
    private readonly ticketsService: TicketsService,
  ) {}

  @Post('reports')
  @ApiOperation({
    summary: 'Area Manager export reports to excel file',
  })
  async exportReports(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: ExportReportDto,
  ) {
    const tickets = await this.ticketsService.findAll(
      {
        _id: {
          $in: dto.ids,
        },
      },
      {
        join: [
          {
            path: 'area',
          },
          {
            path: 'created_by',
          },
        ],
      },
    );
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="reports_${Date.now()}.xlsx"`,
    });
    return await this.exportsService.exportReport(tickets);
  }
}
