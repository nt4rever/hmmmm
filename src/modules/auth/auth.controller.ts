import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseBoolPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LogoutDoc, RefreshAccessTokenDoc, SignInDoc, SignUpDoc } from './docs';
import { SignUpDto } from './dto';
import { JwtAccessTokenGuard, JwtRefreshTokenGuard, LocalAuthGuard } from './guards';
import { RequestWithUser } from '@common/types';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('refresh')
  @RefreshAccessTokenDoc()
  @UseGuards(JwtRefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refreshAccessToken(@Req() request: RequestWithUser) {
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
}
