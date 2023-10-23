import { BaseEntity } from '@/modules/shared/base';
import { Ticket } from '@/modules/tickets/entities';
import { User } from '@/modules/users/entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

export enum TASK_STATUS {
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  DONE = 'DONE',
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Task extends BaseEntity {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  })
  ticket: Ticket;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  assignee: User;

  @Prop({
    required: true,
    type: String,
    enum: TASK_STATUS,
    default: TASK_STATUS.PENDING,
  })
  status: TASK_STATUS;

  @Prop({
    type: String,
  })
  note?: string;

  @Prop({
    type: Date,
    default: Date.now() + 3600 * 1000 * 24, // 24 hours
  })
  expires_at: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
