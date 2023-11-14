import { BaseEntity } from '@/modules/shared/base';
import { User } from '@/modules/users/entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type VoteDocument = HydratedDocument<Vote>;

export enum VOTE_TYPE {
  TICKET = 'TICKET',
  COMMENT = 'COMMENT',
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Vote extends BaseEntity {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  created_by: User;

  @Prop({
    required: true,
    type: Boolean,
  })
  is_up_vote: boolean;

  @Prop({
    required: true,
    type: String,
    enum: VOTE_TYPE,
  })
  type: VOTE_TYPE;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
