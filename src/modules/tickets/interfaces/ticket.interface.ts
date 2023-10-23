import { BaseRepositoryInterface } from '@/repositories/base';
import { EVIDENCE_TYPE, Ticket } from '../entities';

export interface TicketsRepositoryInterface extends BaseRepositoryInterface<Ticket> {
  addEvidence(ticketId: string, evidenceId: string, type: EVIDENCE_TYPE): Promise<Ticket>;
}
