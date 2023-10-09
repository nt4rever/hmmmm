import { Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export class BaseEntity {
  _id?: ObjectId | string;

  id: string;

  @Prop({
    required: false,
    type: Date,
  })
  created_at?: Date;

  @Prop({
    required: false,
    type: Date,
  })
  updated_at?: Date;

  @Prop({
    required: false,
    type: Date,
  })
  deleted_at?: Date;
}
