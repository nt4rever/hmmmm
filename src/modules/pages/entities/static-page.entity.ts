import { BaseEntity } from '@/modules/shared/base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum STATIC_PAGE_TYPE {
  ABOUT = 'ABOUT',
  OTHER = 'OTHER',
}

export type StaticPageDocument = HydratedDocument<StaticPage>;

@Schema({
  collection: 'static_pages',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class StaticPage extends BaseEntity {
  @Prop({
    required: true,
    type: String,
    enum: STATIC_PAGE_TYPE,
  })
  type: STATIC_PAGE_TYPE;

  @Prop({
    required: true,
    type: String,
  })
  content: string;

  @Prop({
    required: false,
    type: String,
  })
  title?: string;

  @Prop({
    required: false,
    type: String,
  })
  brief_content?: string;

  @Prop({
    required: false,
    type: String,
  })
  slug?: string;

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
}

export const StaticPageSchema = SchemaFactory.createForClass(StaticPage);
