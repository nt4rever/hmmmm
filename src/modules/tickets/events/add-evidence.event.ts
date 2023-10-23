import { EVIDENCE_TYPE } from '../entities';

export class AddEvidenceEvent {
  ticketId: string;
  evidenceId: string;
  type: EVIDENCE_TYPE;

  constructor(ticketId: string, evidenceId: string, type: EVIDENCE_TYPE) {
    this.ticketId = ticketId;
    this.evidenceId = evidenceId;
    this.type = type;
  }
}
