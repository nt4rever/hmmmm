export class AssignTaskEvent {
  ticketId: string;

  constructor(ticketId: string) {
    this.ticketId = ticketId;
  }
}
