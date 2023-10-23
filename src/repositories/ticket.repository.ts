import { Ticket, TicketDocument } from '@/modules/tickets/entities';
import { BaseRepositoryAbstract } from './base';
import { TicketsRepositoryInterface } from '@/modules/tickets/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketsRepository
  extends BaseRepositoryAbstract<TicketDocument>
  implements TicketsRepositoryInterface
{
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
  ) {
    super(ticketModel);
  }
}
