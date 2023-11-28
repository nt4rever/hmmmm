import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { TicketsModule } from '../tickets/tickets.module';
import { AreasModule } from '../areas/areas.module';

@Module({
  imports: [TicketsModule, AreasModule],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
