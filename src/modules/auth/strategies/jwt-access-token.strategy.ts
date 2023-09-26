import { UsersService } from '@modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces';
import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_PRIVATE_KEY'),
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.userService.findOneByCondition({
      _id: payload.user_id,
      isActive: true,
    });

    if (!user) throw new UnauthorizedException(ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION);

    return user;
  }
}
