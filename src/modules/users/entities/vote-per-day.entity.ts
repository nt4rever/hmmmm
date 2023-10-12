import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class VotePerDay {
  @Prop({ default: 10 })
  point: number;

  @Prop({ default: Date.now(), type: Date })
  last_used_at: Date;
}

export const VotePerDaySchema = SchemaFactory.createForClass(VotePerDay);
