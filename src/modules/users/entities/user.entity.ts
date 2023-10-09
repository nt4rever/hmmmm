import { Area } from '@modules/areas/entities';
import { BaseEntity, Location, LocationSchema } from '@modules/shared/base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
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
})
export class User extends BaseEntity {
  @Prop()
  first_name?: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop()
  phone_number?: string;

  @Exclude()
  @ApiHideProperty()
  @Prop()
  password?: string;

  @Prop()
  avatar?: string;

  @Prop()
  date_of_birth?: Date;

  @Prop({ enum: GENDER })
  gender?: GENDER;

  @Prop()
  address?: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({
    enum: ROLES,
    default: ROLES.User,
  })
  role: ROLES;

  @Exclude()
  @ApiHideProperty()
  @Prop({
    type: [
      {
        type: RefreshTokenSchema,
      },
    ],
  })
  refresh_token: RefreshToken[];

  @Prop({ type: VotePerDaySchema, default: () => ({}), required: false })
  vote_per_day?: VotePerDay;

  @Prop({ type: LocationSchema, required: false })
  location?: Location;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
  })
  area?: Area;
}

export const UserSchema = SchemaFactory.createForClass(User);
