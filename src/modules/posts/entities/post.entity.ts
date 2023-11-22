import { BaseEntity } from '@/modules/shared/base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PostCategory } from './category.entity';

export type PostDocument = HydratedDocument<Post>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Post extends BaseEntity {
  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    required: false,
    type: String,
  })
  brief_content?: string;

  @Prop({
    required: true,
    type: String,
  })
  content: string;

  @Prop({
    required: false,
    type: String,
  })
  picture?: string;

  @Prop({
    required: false,
    type: [String],
  })
  tag_search?: string[];

  @Prop({
    required: true,
    type: String,
  })
  slug: string;

  @Prop({
    required: false,
    type: String,
  })
  keyword_SEO?: string;

  @Prop({
    required: false,
    type: String,
  })
  description_SEO?: string;

  @Prop({
    required: true,
    type: Number,
    default: 0,
  })
  view_count: number;

  @Prop({
    required: true,
    ref: 'PostCategory',
    type: mongoose.Schema.Types.ObjectId,
  })
  category: PostCategory;
}

export const PostSchema = SchemaFactory.createForClass(Post);
