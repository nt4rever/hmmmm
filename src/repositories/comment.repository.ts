import { CommentsRepositoryInterface } from '@/modules/comments/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base';
import { Comment, CommentDocument } from '@/modules/comments/entities';
import { User } from '@/modules/users/entities';

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

  async addVotedBy(id: string, user: User): Promise<Comment> {
    try {
      return await this.commentModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $push: {
            voted_by: user,
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
