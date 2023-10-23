import { ResponseIdSerialization } from '@/common/serializations';
import { TASK_STATUS } from '../entities';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Ticket } from '@/modules/tickets/entities';
import { TicketGetSerialization } from '@/modules/tickets/serializations/ticket.get.serialization';

export class TaskGetSerialization extends ResponseIdSerialization {
  @Type(() => TicketGetSerialization)
  @ApiProperty({
    type: TicketGetSerialization,
  })
  ticket: Ticket;

  @ApiProperty({
    type: String,
    enum: TASK_STATUS,
  })
  status: TASK_STATUS;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty()
  expires_at: Date;
}
