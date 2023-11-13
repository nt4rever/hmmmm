import { CommentsRepositoryInterface } from '@/modules/comments/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base';
import { Comment, CommentDocument } from '@/modules/comments/entities';

@Injectable()
export class CommentsRepository
  extends BaseRepositoryAbstract<CommentDocument>
  implements CommentsRepositoryInterface
{
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
  ) {
    super(commentModel);
  }
}
