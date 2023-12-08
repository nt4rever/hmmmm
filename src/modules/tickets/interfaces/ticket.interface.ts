import { BaseRepositoryInterface } from '@/repositories/base';
import { EVIDENCE_TYPE, Ticket } from '../entities';
import { Vote } from '@/modules/comments/entities';

export interface TicketsRepositoryInterface extends BaseRepositoryInterface<Ticket> {
  addEvidence(ticketId: string, evidenceId: string, type: EVIDENCE_TYPE): Promise<Ticket>;
  addVotedBy(id: string, vote: Vote): Promise<Ticket>;
  removeVotedBy(id: string, vote: Vote): Promise<Ticket>;
}
