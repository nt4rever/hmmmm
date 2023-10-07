import { BaseEntity } from '@modules/shared/base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AreaDocument = HydratedDocument<Area>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Area extends BaseEntity {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    required: true,
    min: -90,
    max: 90,
  })
  lat: number;

  @Prop({
    required: true,
    min: -180,
    max: 180,
  })
  lng: number;

  @Prop({
    default: 1000,
  })
  radius: number;

  @Prop({
    default: true,
  })
  is_active: boolean;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
