import { BaseEntity } from '@modules/shared/base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { RefreshToken, RefreshTokenSchema } from './refresh-token.entity';
import { VotePerDay, VotePerDaySchema } from './vote-per-day.entity';

export enum GENDER {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}

export enum ROLES {
  Admin = 'ADMIN',
  AreaManager = 'AREA_MANAGER',
  Volunteer = 'VOLUNTEER',
  User = 'USER',
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
  first_name?: string;

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
  phone_number?: string;

  @Exclude()
  @ApiHideProperty()
  @Prop()
  password?: string;

  @Prop()
  avatar?: string;

  @Expose({ name: 'avatar_url' })
  get getAvatar(): string {
    return this.avatar
      ? `${process.env.AWS_ENDPOINT}/${process.env.AWS_S3_BUCKET}/${this.avatar}`
      : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png';
  }

  @Prop()
  date_of_birth?: Date;

  @Prop({
    enum: GENDER,
  })
  gender?: GENDER;

  @Prop({
    default: true,
  })
  is_active: boolean;

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

  @Prop({
    enum: ROLES,
    default: ROLES.User,
  })
  role: ROLES;

  @Prop()
  address?: string;

  @Prop({ type: VotePerDaySchema, default: () => ({}) })
  vote_per_day?: VotePerDay;
}

export const UserSchema = SchemaFactory.createForClass(User);
