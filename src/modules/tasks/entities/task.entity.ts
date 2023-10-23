import { BaseEntity } from '@/modules/shared/base';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Task extends BaseEntity {}

export const TaskSchema = SchemaFactory.createForClass(Task);
