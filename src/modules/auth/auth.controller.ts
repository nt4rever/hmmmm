import { RequestWithUser } from '@/common/types';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseBoolPipe,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LogoutDoc, RefreshAccessTokenDoc, SignInDoc, SignUpDoc } from './docs';
import { ChangePasswordDto, ForgotPasswordDto, SignUpDto } from './dto';
import { JwtAccessTokenGuard, JwtRefreshTokenGuard, LocalAuthGuard } from './guards';
import { ROLES } from '../users/entities';
import { Throttle } from '@nestjs/throttler';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sign-up')
  @SignUpDoc()
  async signUp(@Body() dto: SignUpDto) {
    return await this.authService.signUp(dto);
  }

  @Post('sign-in')
  @SignInDoc()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async signIn(@Req() request: RequestWithUser) {
    return await this.authService.signIn(request.user.id);
  }

  @Post('sign-in-admin')
  @SignInDoc()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async signAmin(@Req() request: RequestWithUser) {
    if (![ROLES.Admin, ROLES.AreaManager].includes(request.user.role)) {
      throw new UnauthorizedException();
    }
    return await this.authService.signIn(request.user.id);
  }

  @Post('refresh')
  @RefreshAccessTokenDoc()
  @UseGuards(JwtRefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refreshAccessToken(@Req() request: RequestWithUser) {
    await this.usersService.updateRefreshToken(request.user.id, request['tokenId']);
    const accessToken = this.authService.generateAccessToken({
      user_id: request.user.id,
      token_id: request['tokenId'],
    });
    return {
      accessToken,
    };
  }

  @Get('logout')
  @LogoutDoc()
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logOut(
    @Req() request: RequestWithUser,
    @Query('all_device', new ParseBoolPipe({ optional: true })) allDevice?: boolean,
  ) {
    await this.authService.logOut(request.user.id, request['tokenId'], allDevice);
  }

  @Post('change-password')
  @ApiOperation({
    summary: 'User has logged in change password',
  })
  @ApiBearerAuth('token')
  @ApiNoContentResponse()
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(@Body() dto: ChangePasswordDto, @Req() { user }: RequestWithUser) {
    try {
      await this.authService.verifyPlainContentWithHashedContent(
        dto.old_password,
        user.password,
      );
      const hashedPassword = await argon2.hash(dto.new_password);
      await this.usersService.update(user.id, {
        password: hashedPassword,
      });
    } catch (error) {
      throw new BadRequestException(ERRORS_DICTIONARY.CHANGE_PASSWORD_FAIL);
    }
  }

  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Post('forgot-password')
  @ApiOperation({
    summary: 'User send request forgot password',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
  }

  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @Post('reset-password')
  @ApiOperation({
    summary: 'User reset password with token',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
  }
}
