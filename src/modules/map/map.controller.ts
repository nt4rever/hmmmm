import { FindAllSerialization } from '@/decorators/api-find-all.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { AreasService } from '../areas/areas.service';
import { AreaGetSerialization } from '../areas/serializations';
import { TicketMinimumGetSerialization } from '../tickets/serializations';
import { TicketsService } from '../tickets/tickets.service';
import { GetMapDto } from './dto';
import { MapService } from './map.service';

@Controller('map')
export class MapController {
  constructor(
    private readonly mapService: MapService,
    private readonly areasService: AreasService,
    private readonly ticketsService: TicketsService,
  ) {}

  @Get('lat-lng-area')
  @FindAllSerialization({
    classToIntercept: AreaGetSerialization,
    isArray: true,
  })
  async latLngArea(@Query() dto: GetMapDto) {
    return await this.areasService.findAll({
      lat: {
        $lte: dto.neLat,
        $gte: dto.swLat,
      },
      lng: {
        $lte: dto.neLng,
        $gte: dto.swLng,
      },
    });
  }

  @Get('lat-lng-ticket')
  @FindAllSerialization({
    classToIntercept: TicketMinimumGetSerialization,
    isArray: true,
  })
  async latLngTicket(@Query() dto: GetMapDto) {
    return await this.ticketsService.findAll(
      {
        lat: {
          $lte: dto.neLat,
          $gte: dto.swLat,
        },
        lng: {
          $lte: dto.neLng,
          $gte: dto.swLng,
        },
      },
      {
        join: [
          {
            path: 'created_by',
            select: 'first_name last_name role avatar',
          },
          {
            path: 'area',
          },
        ],
        select: {
          evidences: 0,
          images: 0,
          comment_count: 0,
          view_count: 0,
          voted_by: 0,
        },
        paging: {
          limit: 100,
          offset: 0,
        },
      },
    );
  }
}
