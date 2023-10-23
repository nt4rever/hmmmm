import { BaseEntity } from '@/modules/shared/base';
import { User } from '@/modules/users/entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export enum EVIDENCE_TYPE {
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  TENTATIVE = 'TENTATIVE',
}

export type EvidenceDocument = HydratedDocument<Evidence>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Evidence extends BaseEntity {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  created_by: User;

  @Prop({
    type: String,
    trim: true,
  })
  content?: string;

  @Prop({
    type: [String],
  })
  images?: string[];

  @Prop({
    required: true,
    type: String,
    enum: EVIDENCE_TYPE,
  })
  type: EVIDENCE_TYPE;

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
}

export const EvidenceSchema = SchemaFactory.createForClass(Evidence);
