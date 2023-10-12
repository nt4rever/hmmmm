import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base';
import { UserDocument, User, RefreshToken } from '@/modules/users/entities';
import { UsersRepositoryInterface } from '@/modules/users/interfaces';

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
              refresh_token: { id },
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

  async updateRefreshToken(userId: string, id: string) {
    try {
      return await this.userModel.findOneAndUpdate(
        {
          _id: userId,
          'refresh_token.id': id,
        },
        {
          $set: {
            'refresh_token.$.last_used_at': Date.now(),
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
