import { BaseServiceAbstract } from '@/services/base';
import { Inject, Injectable } from '@nestjs/common';
import { CreatePostCategoryDto } from './dto';
import { Post } from './entities';
import { PostCategoryRepositoryInterface } from './interfaces/category.interface';
import { PostRepositoryInterface } from './interfaces/post.interface';

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
      return await this.postCategoriesRepository.findOneById(id);
    } catch (error) {
      throw error;
    }
  }

  async removeCategory(id: string) {
    try {
      await this.postCategoriesRepository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
