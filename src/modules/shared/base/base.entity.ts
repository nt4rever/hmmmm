import { Prop } from '@nestjs/mongoose';
import { ApiHideProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class BaseEntity {
  @ApiHideProperty()
  _id?: ObjectId | string;

  @Expose()
  @Transform((value) => value.obj?._id?.toString(), { toClassOnly: true })
  id?: string;

  created_at?: Date;

  updated_at?: Date;

  @Prop({ default: null })
  deleted_at?: Date;
}
