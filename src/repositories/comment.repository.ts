import { Comment, CommentDocument, Vote } from '@/modules/comments/entities';
import { CommentsRepositoryInterface } from '@/modules/comments/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base';

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

  async addVotedBy(id: string, vote: Vote): Promise<Comment> {
    try {
      return await this.commentModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $push: {
            voted_by: vote,
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async removeVotedBy(id: string, vote: Vote) {
    try {
      return await this.commentModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $pull: {
            voted_by: vote,
          },
          $inc: {
            score: vote.is_up_vote ? -1 : 1,
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
