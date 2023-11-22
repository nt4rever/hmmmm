import { Post, PostDocument } from '@/modules/posts/entities';
import { PostRepositoryInterface } from '@/modules/posts/interfaces/post.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base';

@Injectable()
export class PostRepository
  extends BaseRepositoryAbstract<PostDocument>
  implements PostRepositoryInterface
{
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {
    super(postModel);
  }
}
