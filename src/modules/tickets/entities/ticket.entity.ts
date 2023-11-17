import { Area } from '@/modules/areas/entities';
import { BaseEntity } from '@/modules/shared/base';
import { User } from '@/modules/users/entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Evidence } from './evidence.entity';
import { Vote } from '@/modules/comments/entities';

export enum TICKET_STATUS {
  NEW = 'NEW',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  IN_PROCESS = 'IN_PROCESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Ticket extends BaseEntity {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
  })
  area: Area;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  created_by: User;

  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  title: string;

  @Prop({
    type: String,
    trim: true,
  })
  description?: string;

  @Prop({
    required: true,
    type: [String],
  })
  images: string[];

  @Prop({
    required: true,
    type: String,
    enum: TICKET_STATUS,
    default: TICKET_STATUS.NEW,
  })
  status: TICKET_STATUS;

  @Prop({
    required: true,
    min: -90,
    max: 90,
  })
  lat: number;

  @Prop({
    required: true,
    min: -180,
    max: 180,
  })
  lng: number;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' }],
  })
  evidences: Evidence[];

  @Prop({
    type: String,
    trim: true,
  })
  close_message?: string;

  @Prop({
    type: String,
    trim: true,
  })
  resolve_message?: string;

  @Prop({
    required: true,
    default: 0,
  })
  score: number;

  @Prop({
    required: true,
    min: 0,
    default: 0,
  })
  view_count: number;

  @Prop({
    type: String,
    trim: true,
  })
  severity_level?: string; // To be determined in future

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vote' }],
  })
  voted_by: Vote[];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

TicketSchema.virtual('comment_count', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'ticket',
  count: true,
});
