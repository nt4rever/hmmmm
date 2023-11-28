import * as dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
});
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class TicketPerDay {
  @Prop({ default: parseInt(process.env.TICKET_PER_DAY, 10) || 10 })
  count: number;

  @Prop({ default: Date.now, type: Date })
  last_used_at: Date;
}

export const TicketPerDaySchema = SchemaFactory.createForClass(TicketPerDay);
