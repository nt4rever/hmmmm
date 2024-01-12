import { Ticket } from '@/modules/tickets/entities';
import { getFullName } from '@/utils/string';

export class TicketToRowExcelDto {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: Date;
  area: string;
  location: string;
  location_map_link: string;
  status: string;
  images: string;
  link: string;

  constructor(ticket: Ticket) {
    this.id = ticket._id.toString();
    this.title = ticket.title;
    this.description = ticket.description;
    this.created_by = getFullName(
      ticket.created_by.first_name,
      ticket.created_by.last_name,
    );
    this.created_at = ticket.created_at;
    this.area = ticket.area.name;
    this.location = `${ticket.lat}, ${ticket.lng}`;
    this.location_map_link = `https://www.google.com/maps/search/?api=1&query=${ticket.lat},${ticket.lng}`;
    this.status = ticket.status;
    this.images = ticket.images.join('\n');
    this.link = `${process.env.APP_URL}/forum/${this.id}`;
  }
}
