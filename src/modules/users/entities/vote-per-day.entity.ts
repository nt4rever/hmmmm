import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class VotePerDay {
  @Prop({ default: 10 })
  point: number;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const VotePerDaySchema = SchemaFactory.createForClass(VotePerDay);
