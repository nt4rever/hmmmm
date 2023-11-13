import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class TicketPerDay {
  @Prop({ default: 10 })
  count: number;

  @Prop({ default: Date.now(), type: Date })
  last_used_at: Date;
}

export const TicketPerDaySchema = SchemaFactory.createForClass(TicketPerDay);
