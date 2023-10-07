import { Area } from '@modules/areas/entities';
import { BaseEntity } from '@modules/shared/base';
import { User } from '@modules/users/entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserAreaDocument = HydratedDocument<UserArea>;
@Schema({
  collection: 'user-areas',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class UserArea extends BaseEntity {
  @Prop({
    min: -90,
    max: 90,
  })
  lat: number;

  @Prop({
    min: -180,
    max: 180,
  })
  lng: number;

  @Prop({
    required: false,
  })
  radius: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
    required: true,
  })
  area: Area;

  @ApiProperty({
    type: String,
  })
  @Expose({ name: 'user_id' })
  get user_id() {
    return this.user.toString();
  }

  @ApiProperty({
    type: String,
  })
  @Expose({ name: 'area_id' })
  get area_id() {
    return this.area.toString();
  }
}

export const UserAreaSchema = SchemaFactory.createForClass(UserArea);
