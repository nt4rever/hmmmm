import { BaseEntity } from '@/modules/shared/base';
import { Ticket } from '@/modules/tickets/entities';
import { User } from '@/modules/users/entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Comment extends BaseEntity {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  created_by: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  })
  ticket: Ticket;

  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  content: string;

  @Prop({
    required: true,
    default: 0,
  })
  score: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
