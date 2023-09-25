import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BaseServiceAbstract } from '@services/base';
import { RefreshToken, User } from './entities';
import { UsersRepositoryInterface } from './interfaces';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UsersRepositoryInterface,
  ) {
    super(usersRepository);
  }

  async setCurrentRefreshToken(userId: string, data: RefreshToken) {
    try {
      await this.usersRepository.addRefreshToken(userId, data);
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneByCondition({ email });
      if (!user) {
        throw new NotFoundException(ERRORS_DICTIONARY.USER_NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
