import { AwsService } from '@modules/aws/aws.service';
import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from '@services/base';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto';
import { RefreshToken, User } from './entities';
import { UsersRepositoryInterface } from './interfaces';
import { Area } from '@modules/areas/entities';
import { Location } from '@modules/shared/base';

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
      const key = `avatars/${user.id}/${randomUUID()}.${file.originalname
        .split('.')
        .at(-1)}`;

      await this.awsService.uploadPublicFile(file.buffer, key);

      if (user.avatar) {
        this.awsService.deleteFile(user.avatar);
      }

      return await this.usersRepository.update(user.id, {
        avatar: key,
      });
    } catch (error) {
      throw error;
    }
  }

  async registerUser(dto: CreateUserDto & { area?: Area; location?: Location }) {
    try {
      const hashedPassword = await argon2.hash(dto.password);
      return await this.usersRepository.create({ ...dto, password: hashedPassword });
    } catch (error) {
      throw error;
    }
  }
}
