import { BaseEntity } from '@/modules/shared/base';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VoteDocument = HydratedDocument<Vote>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Vote extends BaseEntity {}

export const VoteSchema = SchemaFactory.createForClass(Vote);
