import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces';
import { Request } from 'express';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_PRIVATE_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const user = await this.userService.findOneByCondition({
      _id: payload.user_id,
      is_active: true,
    });

    if (!user) throw new UnauthorizedException(ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION);
    // Set current refresh token id into request
    request['tokenId'] = payload.token_id;
    return user;
  }
}
