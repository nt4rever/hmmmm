export class UploadTicketImageEvent {
  ticketId: string;
  images: Express.Multer.File[];

  constructor(ticketId: string, images: Express.Multer.File[]) {
    this.ticketId = ticketId;
    this.images = images;
  }
}
