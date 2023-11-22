import { PostCategory, PostCategoryDocument } from '@/modules/posts/entities';
import { PostCategoryRepositoryInterface } from '@/modules/posts/interfaces/category.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base';

@Injectable()
export class PostCategoriesRepository
  extends BaseRepositoryAbstract<PostCategoryDocument>
  implements PostCategoryRepositoryInterface
{
  constructor(
    @InjectModel(PostCategory.name)
    private readonly postCategoriesModel: Model<PostCategoryDocument>,
  ) {
    super(postCategoriesModel);
  }
}
