import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from '@services/base';
import { RefreshToken, User } from './entities';
import { UsersRepositoryInterface } from './interfaces';
import { AwsService } from '@modules/aws/aws.service';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly awsService: AwsService,
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

  async removeAccessToken(userId: string, tokenId: string, allDevice = false) {
    try {
      await this.usersRepository.removeRefreshToken(userId, tokenId, allDevice);
    } catch (error) {
      throw error;
    }
  }

  async uploadAvatar(user: User, file: Express.Multer.File) {
    try {
      const key = `avatars/${user._id.toString()}/${randomUUID()}.${file.originalname
        .split('.')
        .at(-1)}`;

      await this.awsService.uploadPublicFile(file.buffer, key);

      if (user.avatar) {
        this.awsService.deleteFile(user.avatar);
      }

      return await this.usersRepository.update(user._id.toString(), {
        avatar: key,
      });
    } catch (error) {
      throw error;
    }
  }
}
