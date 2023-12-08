import { EVIDENCE_TYPE, Ticket, TicketDocument } from '@/modules/tickets/entities';
import { BaseRepositoryAbstract } from './base';
import { TicketsRepositoryInterface } from '@/modules/tickets/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Vote } from '@/modules/comments/entities';

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

  async addVotedBy(id: string, vote: Vote): Promise<Ticket> {
    try {
      return await this.ticketModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $push: {
            voted_by: vote,
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async removeVotedBy(id: string, vote: Vote) {
    try {
      return await this.ticketModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $pull: {
            voted_by: vote,
          },
          $inc: {
            score: vote.is_up_vote ? -1 : 1,
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async addEvidence(ticketId: string, evidenceId: string, type: EVIDENCE_TYPE) {
    try {
      const data =
        type != EVIDENCE_TYPE.TENTATIVE
          ? {
              status: type,
            }
          : {};
      return await this.ticketModel.findOneAndUpdate(
        {
          _id: ticketId,
        },
        {
          ...data,
          $push: {
            evidences: evidenceId,
          },
        },
        {
          new: true,
          upsert: true,
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
