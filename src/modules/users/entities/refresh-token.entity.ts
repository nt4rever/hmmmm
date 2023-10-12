import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class RefreshToken {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  token: string;

  @Prop({ maxlength: 100 })
  device_name?: string;

  @Prop({
    default: Date.now(),
    type: Date,
  })
  created_at?: Date;

  @Prop({
    required: false,
    type: Date,
  })
  last_used_at?: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
