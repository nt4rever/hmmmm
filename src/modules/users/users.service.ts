import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto';
import { RefreshToken, User } from './entities';
import { UsersRepositoryInterface } from './interfaces';
import { BaseServiceAbstract } from '@/services/base';
import { Injectable, Inject } from '@nestjs/common';
import { Area } from '../areas/entities';
import { AwsService } from '../aws/aws.service';
import { Location } from '../shared/base';

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

  async canCreateTicket(user: User) {
    try {
      let count = 10;

      if (user.ticket_per_day) {
        const diff = Date.now() - user.ticket_per_day.last_used_at.getTime();
        if (diff > 1000 * 60 * 60 * 24) {
          count = 10;
        } else {
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
      let point = 10;

      if (user.vote_per_day) {
        const diff = Date.now() - user.vote_per_day.last_used_at.getTime();
        if (diff > 1000 * 60 * 60 * 24) {
          point = 10;
        } else {
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
}
