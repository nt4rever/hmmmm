import { UserArea, UserAreaDocument } from '@modules/user-areas/entities';
import { UserAreasRepositoryInterface } from '@modules/user-areas/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base';

@Injectable()
export class UserAreasRepository
  extends BaseRepositoryAbstract<UserAreaDocument>
  implements UserAreasRepositoryInterface
{
  constructor(
    @InjectModel(UserArea.name)
    private readonly userAreaModel: Model<UserAreaDocument>,
  ) {
    super(userAreaModel);
  }
}
