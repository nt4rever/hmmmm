import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto';
import { RefreshToken, User } from './entities';
import { UsersRepositoryInterface } from './interfaces';
import { BaseServiceAbstract } from '@/services/base';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { Area } from '../areas/entities';
import { AwsService } from '../aws/aws.service';
import { Location } from '../shared/base';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { resizedImage } from '@/utils/resizeImage';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly awsService: AwsService,
    private readonly configService: ConfigService,
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

  async updateRefreshToken(userId: string, tokenId: string) {
    try {
      await this.usersRepository.updateRefreshToken(userId, tokenId);
    } catch (error) {
      throw error;
    }
  }

  async uploadAvatar(user: User, file: Express.Multer.File) {
    try {
      const key = `avatars/${user.id}/${randomUUID()}.${file.originalname
        .split('.')
        .at(-1)}`;
      const imageResized = await resizedImage(file.buffer, { width: 100, height: 100 });
      await this.awsService.uploadPublicFile(imageResized, key);

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

  async canCreateTicket(user: User) {
    try {
      let count = this.configService.get<number>('limit.ticket_per_day'); // default is 10

      if (user.ticket_per_day) {
        const currentDate = new Date();
        // Check is last used at is not today
        if (
          currentDate.setHours(0, 0, 0, 0) !=
          user.ticket_per_day.last_used_at.setHours(0, 0, 0, 0)
        ) {
          count = user.ticket_per_day.count;
        }
      }

      if (count === 0) return false;

      await this.usersRepository.update(user.id, {
        ticket_per_day: {
          count: count - 1,
          last_used_at: new Date(),
        },
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async canVote(user: User) {
    try {
      let point = this.configService.get<number>('limit.vote_per_day'); // default is 10

      if (user.vote_per_day) {
        const currentDate = new Date();
        // Check is last used at is not today
        if (
          currentDate.setHours(0, 0, 0, 0) !=
          user.vote_per_day.last_used_at.setHours(0, 0, 0, 0)
        ) {
          point = user.vote_per_day.point;
        }
      }

      if (point === 0) return false;

      await this.usersRepository.update(user.id, {
        vote_per_day: {
          point: point - 1,
          last_used_at: new Date(),
        },
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'remove-token-expires',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleRemoveTokenExpires() {
    try {
      this.logger.warn('Schedule remove token expires is running...');
      this.usersRepository.removeTokenExpires();
      this.logger.warn('Schedule remove token expires DONE');
    } catch (error) {}
  }
}
