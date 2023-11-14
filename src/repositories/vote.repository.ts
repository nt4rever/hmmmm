import { Vote, VoteDocument } from '@/modules/comments/entities';
import { VotesRepositoryInterface } from '@/modules/comments/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base';

@Injectable()
export class VotesRepository
  extends BaseRepositoryAbstract<VoteDocument>
  implements VotesRepositoryInterface
{
  constructor(@InjectModel(Vote.name) private readonly voteModel: Model<VoteDocument>) {
    super(voteModel);
  }
}
