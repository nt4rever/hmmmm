import { BaseServiceAbstract } from '@/services/base';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entities';
import { PostCategoryRepositoryInterface } from './interfaces/category.interface';
import { PostRepositoryInterface } from './interfaces/post.interface';
import { CreatePostCategoryDto } from './dto';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';

@Injectable()
export class PostsService extends BaseServiceAbstract<Post> {
  constructor(
    @Inject('PostRepositoryInterface')
    private readonly postsRepository: PostRepositoryInterface,
    @Inject('PostCategoryRepositoryInterface')
    private readonly postCategoriesRepository: PostCategoryRepositoryInterface,
  ) {
    super(postsRepository);
  }

  async createCategory(dto: CreatePostCategoryDto) {
    try {
      return await this.postCategoriesRepository.create(dto);
    } catch (error) {
      throw error;
    }
  }

  async allCategory() {
    try {
      return await this.postCategoriesRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async findCategory(id: string) {
    try {
      const category = await this.postCategoriesRepository.findOneById(id);
      if (!category) {
        throw new NotFoundException(ERRORS_DICTIONARY.POST_CATEGORY_NOT_FOUND);
      }
      return category;
    } catch (error) {
      throw error;
    }
  }
}
