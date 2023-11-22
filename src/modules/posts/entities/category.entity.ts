import { BaseEntity } from '@/modules/shared/base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostCategoryDocument = HydratedDocument<PostCategory>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class PostCategory extends BaseEntity {
  @Prop({
    required: true,
    type: String,
  })
  name: string;
}

export const PostCategorySchema = SchemaFactory.createForClass(PostCategory);
