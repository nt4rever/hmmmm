import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { sha256 } from '@/utils/crypto';
import { InjectQueue } from '@nestjs/bullmq';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Queue } from 'bullmq';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import { User } from '../users/entities';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto';
import { TokenPayload } from './interfaces';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private logger: Logger;

  constructor(
    private configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('mail-auth')
    private readonly mailQueue: Queue,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async signUp(dto: SignUpDto) {
    try {
      // Find exists User (with trashed).
      const existedUser = await this.usersService.findOneByCondition({
        email: dto.email,
        deleted_at: {
          $exists: true,
        },
      });
      if (existedUser) {
        throw new ConflictException(ERRORS_DICTIONARY.EMAIL_EXISTED);
      }

      const hash = await argon2.hash(dto.password);
      const user = await this.usersService.create({
        ...dto,
        password: hash,
      });

      const refreshToken = await this.storeRefreshToken(user.id, dto.device_name);
      const accessToken = this.generateAccessToken({
        user_id: user.id,
        token_id: refreshToken.tokenId,
      });

      return {
        accessToken,
        refreshToken: refreshToken.token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findOneByCondition({
        email,
        is_active: true,
      });
      if (!user) throw new UnauthorizedException();
      await this.verifyPlainContentWithHashedContent(password, user.password);

      return user;
    } catch (error) {
      throw new UnauthorizedException(ERRORS_DICTIONARY.WRONG_CREDENTIALS);
    }
  }

  async signIn(userId: string) {
    try {
      const refreshToken = await this.storeRefreshToken(userId);
      const accessToken = this.generateAccessToken({
        user_id: userId,
        token_id: refreshToken.tokenId,
      });

      return {
        accessToken,
        refreshToken: refreshToken.token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserIfRefreshTokenMatched(
    userId: string,
    tokenId: string,
    token: string,
  ): Promise<User> {
    try {
      const user = await this.usersService.findOneByCondition({
        _id: userId,
        is_active: true,
      });
      if (!user) {
        throw new UnauthorizedException(ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION);
      }
      const refreshToken = user.refresh_token.find((x) => x.id === tokenId)?.token;

      if (!refreshToken) {
        throw new UnauthorizedException(ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION);
      }
      await this.verifyPlainContentWithHashedContent(token, refreshToken);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async logOut(userId: string, tokenId: string, allDevice?: boolean) {
    try {
      await this.usersService.removeAccessToken(userId, tokenId, allDevice);
    } catch (error) {
      throw error;
    }
  }

  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      privateKey: this.configService.get<string>('jwt.access_private_key'),
      expiresIn: this.configService.get<number>('jwt.access_expiration_time') || '1h',
    });
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      privateKey: this.configService.get<string>('jwt.refresh_private_key'),
      expiresIn: this.configService.get<number>('jwt.refresh_expiration_time') || '7d',
    });
  }

  async storeRefreshToken(
    userId: string,
    device_name?: string,
  ): Promise<{ token: string; tokenId: string }> {
    try {
      const tokenId = randomUUID();
      const token = this.generateRefreshToken({
        user_id: userId,
        token_id: tokenId,
      });
      const hashedToken = await argon2.hash(token);
      await this.usersService.setCurrentRefreshToken(userId, {
        id: tokenId,
        token: hashedToken,
        device_name,
      });

      return { token, tokenId };
    } catch (error) {
      throw error;
    }
  }

  async verifyPlainContentWithHashedContent(plainText: string, hashedText: string) {
    const isMatching = await argon2.verify(hashedText, plainText);
    if (!isMatching) {
      throw new UnauthorizedException();
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.usersService.findOneByCondition({ email });

      if (!user) return;
      const token = sha256(`${randomUUID()}-${Date.now()}-${user.id}`);
      await this.cacheManager.set(user.id, token, 1000 * 60 * 30); // 30 minutes

      this.mailQueue.add(
        'forgot-password',
        {
          user,
          token,
        },
        { removeOnComplete: true },
      );
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const user = await this.usersService.findOne(dto.user_id);
      if (!user) {
        throw new NotFoundException(ERRORS_DICTIONARY.USER_NOT_FOUND);
      }

      const key = await this.cacheManager.get<string>(dto.user_id);
      if (!key || key !== dto.token) {
        throw new BadRequestException(ERRORS_DICTIONARY.UPDATE_FAIL);
      }

      const hashedPassword = await argon2.hash(dto.password);
      await this.usersService.update(user.id, {
        password: hashedPassword,
        refresh_token: [], // Remove all refresh token in DB (logout all device)
      });
      await this.cacheManager.del(dto.user_id);
    } catch (error) {
      throw error;
    }
  }
}
