import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostCategory, PostCategorySchema, PostSchema } from './entities';
import { PostRepository } from '@/repositories/post.repository';
import { PostCategoriesRepository } from '@/repositories/post-categoy.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PostCategory.name,
        schema: PostCategorySchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    {
      provide: 'PostRepositoryInterface',
      useClass: PostRepository,
    },
    {
      provide: 'PostCategoryRepositoryInterface',
      useClass: PostCategoriesRepository,
    },
  ],
})
export class PostsModule {}
