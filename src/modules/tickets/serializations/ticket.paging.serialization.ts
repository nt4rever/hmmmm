import { ResponsePagingSerialization } from '@/common/serializations';
import { Type } from 'class-transformer';
import { TicketGetSerialization } from './ticket.get.serialization';
import { ApiProperty } from '@nestjs/swagger';

export class TicketPagingSerialization extends ResponsePagingSerialization {
  @Type(() => TicketGetSerialization)
  @ApiProperty({
    type: TicketGetSerialization,
    isArray: true,
  })
  items: TicketGetSerialization[];
}
