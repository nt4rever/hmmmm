import { OmitType } from '@nestjs/swagger';
import { TicketGetSerialization } from './ticket.get.serialization';

export class TicketMinimumGetSerialization extends OmitType(TicketGetSerialization, [
  'evidences',
  'voted_by_me',
  'comment_count',
  'images',
  'voted_by',
]) {}
