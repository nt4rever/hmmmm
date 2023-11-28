import * as dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
});
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class VotePerDay {
  @Prop({ default: parseInt(process.env.VOTE_PER_DAY, 10) || 10 })
  point: number;

  @Prop({ default: Date.now, type: Date })
  last_used_at: Date;
}

export const VotePerDaySchema = SchemaFactory.createForClass(VotePerDay);
