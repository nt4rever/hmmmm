import { ResponseIdSerialization } from '@/common/serializations';
import { Ticket } from '@/modules/tickets/entities';
import {
  CreatedBySerialization,
  TicketGetSerialization,
} from '@/modules/tickets/serializations/ticket.get.serialization';
import { User } from '@/modules/users/entities';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TASK_STATUS } from '../entities';

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

  @Type(() => CreatedBySerialization)
  @ApiPropertyOptional({
    type: CreatedBySerialization,
  })
  assignee?: User;
}
