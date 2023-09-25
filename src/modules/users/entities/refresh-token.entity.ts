import { BaseEntity } from '@modules/shared/base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class RefreshToken extends BaseEntity {
  @Prop({ required: true })
  token: string;

  @Prop({ maxlength: 100 })
  device_name: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
