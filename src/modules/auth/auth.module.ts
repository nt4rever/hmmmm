import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  JwtAccessTokenStrategy,
  JwtRefreshTokenStrategy,
  LocalStrategy,
} from './strategies';
import { BullModule } from '@nestjs/bullmq';
import { SendMailProcessor } from './queues/auth.processor';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    BullModule.registerQueue({
      name: 'mail-auth',
      prefix: 'auth',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    SendMailProcessor,
  ],
})
export class AuthModule {}
