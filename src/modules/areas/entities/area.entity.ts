import { BaseEntity } from '@modules/shared/base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Location } from './location.entity';

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
    default: true,
  })
  is_active: boolean;

  @Prop({
    required: true,
    type: Location,
  })
  location: Location;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
