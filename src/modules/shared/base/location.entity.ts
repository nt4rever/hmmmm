import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class Location {
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
    min: 0,
  })
  radius?: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
