import { UploadTicketImageEvent } from '@/modules/tickets/events';

export class UploadEvidenceImageEvent extends UploadTicketImageEvent {
  evidenceId: string;
  constructor(ticketId: string, evidenceId: string, images: Express.Multer.File[]) {
    super(ticketId, images);
    this.evidenceId = evidenceId;
  }
}
