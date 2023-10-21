export class SendEmailTicketCreatedEvent {
  email: string;
  ticketId: string;

  constructor(email: string, ticketId: string) {
    this.email = email;
    this.ticketId = ticketId;
  }
}
