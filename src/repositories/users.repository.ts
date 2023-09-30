import { RefreshToken, User, UserDocument } from '@modules/users/entities';
import { UsersRepositoryInterface } from '@modules/users/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base';

@Injectable()
export class UsersRepository
  extends BaseRepositoryAbstract<UserDocument>
  implements UsersRepositoryInterface
{
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  async addRefreshToken(userId: string, data: RefreshToken) {
    try {
      return await this.userModel.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $push: {
            refresh_token: data,
          },
        },
        {
          new: true,
          upsert: true,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async removeRefreshToken(userId: string, id: string, allDevice = false) {
    try {
      const removeCondition = allDevice
        ? {
            refresh_token: [],
          }
        : {
            $pull: {
              refresh_token: {
                _id: id,
              },
            },
          };
      return await this.userModel.findOneAndUpdate(
        {
          _id: userId,
        },
        removeCondition,
      );
    } catch (error) {
      throw error;
    }
  }
}
