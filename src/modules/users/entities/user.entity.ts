import { BaseEntity } from '@modules/shared/base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RefreshToken, RefreshTokenSchema } from './refresh-token.entity';
import { Exclude, Type } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

export enum GENDER {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User extends BaseEntity {
  @Prop({
    minlength: 1,
    maxlength: 60,
    set: (value: string) => value.trim(),
  })
  first_name: string;

  @Prop({
    required: true,
    minlength: 1,
    maxlength: 60,
    set: (value: string) => value.trim(),
  })
  last_name: string;

  @Prop({
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  })
  email: string;

  @Prop({
    minlength: 1,
    maxlength: 15,
  })
  phone_number: string;

  @Exclude()
  @ApiHideProperty()
  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
  })
  avatar: string;

  @Prop()
  date_of_birth: Date;

  @Prop({
    enum: GENDER,
  })
  gender: string;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Exclude()
  @ApiHideProperty()
  @Prop({
    type: [
      {
        type: RefreshTokenSchema,
      },
    ],
  })
  @Type(() => RefreshToken)
  refresh_token: RefreshToken[];
}

export const UserSchema = SchemaFactory.createForClass(User);
