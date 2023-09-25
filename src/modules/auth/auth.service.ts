import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';
import { User } from '@modules/users/entities';
import { UsersService } from '@modules/users/users.service';
import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import mongoose from 'mongoose';
import { SignUpDto } from './dto';
import { TokenPayload } from './interfaces';

@Injectable()
export class AuthService {
  private logger: Logger;

  constructor(
    private configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async signUp(dto: SignUpDto) {
    try {
      const existedUser = await this.usersService.findOneByCondition({
        email: dto.email,
      });
      if (existedUser) {
        throw new ConflictException(ERRORS_DICTIONARY.EMAIL_EXISTED);
      }

      const hash = await argon2.hash(dto.password);
      const user = await this.usersService.create({
        ...dto,
        password: hash,
      });

      const refreshToken = await this.storeRefreshToken(
        user._id.toString(),
        dto.device_name,
      );
      const accessToken = this.generateAccessToken({
        user_id: user._id.toString(),
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.getUserByEmail(email);
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
      });

      return {
        accessToken,
        refreshToken,
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
      });
      if (!user) {
        throw new UnauthorizedException(ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION);
      }
      const refreshToken = user.refresh_token.find((x) => x._id.toString() === tokenId)
        ?.token;

      if (!refreshToken) {
        throw new UnauthorizedException(ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION);
      }
      await this.verifyPlainContentWithHashedContent(token, refreshToken);

      return user;
    } catch (error) {
      throw error;
    }
  }

  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      privateKey: this.configService.get<string>('JWT_ACCESS_TOKEN_PRIVATE_KEY'),
      expiresIn:
        this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME') || '1h',
    });
  }

  generateRefreshToken(payload: TokenPayload & { token_id: string }) {
    return this.jwtService.sign(payload, {
      privateKey: this.configService.get<string>('JWT_REFRESH_TOKEN_PRIVATE_KEY'),
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME') || '7d',
    });
  }

  async storeRefreshToken(userId: string, device_name?: string): Promise<string> {
    try {
      const tokenId = new mongoose.Types.ObjectId().toString();
      const token = this.generateRefreshToken({
        user_id: userId,
        token_id: tokenId,
      });
      const hashedToken = await argon2.hash(token);
      await this.usersService.setCurrentRefreshToken(userId, {
        _id: tokenId,
        token: hashedToken,
        device_name,
      });

      return token;
    } catch (error) {
      throw error;
    }
  }

  private async verifyPlainContentWithHashedContent(
    plainText: string,
    hashedText: string,
  ) {
    const isMatching = await argon2.verify(hashedText, plainText);
    if (!isMatching) {
      throw new UnauthorizedException();
    }
  }
}