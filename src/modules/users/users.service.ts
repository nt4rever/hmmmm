import { Inject, Injectable } from '@nestjs/common';
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
}
