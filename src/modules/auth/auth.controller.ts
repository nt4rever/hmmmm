import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';
import { RequestWithUser } from '@custom-types/requests.type';
import { faker } from '@faker-js/faker';
import { GENDER } from '@modules/users/entities';
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAccessTokenGuard } from './guards/jwt-access-token.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiBody({
    type: SignUpDto,
    examples: {
      random_user: {
        value: {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          email: faker.internet.email(),
          phone_number: '+84xxxxxxxxx',
          date_of_birth: faker.date.birthdate(),
          password: 'password',
          gender: GENDER.Male,
          device_name: 'Iphone XS',
        } as SignUpDto,
      },
      default_user: {
        value: {
          first_name: 'John',
          last_name: 'Alice',
          email: 'alice@gmail.com',
          password: 'abcd1234@@',
        } as SignUpDto,
      },
    },
  })
  @ApiCreatedResponse({
    description: 'User created successfully!!',
    content: {
      'application/json': {
        examples: {
          created_user: {
            summary: 'Response after sign up',
            value: {
              accessToken: 'token',
              refreshToken: 'token',
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    content: {
      'application/json': {
        examples: {
          invalid_email_password: {
            value: {
              statusCode: 400,
              message: ERRORS_DICTIONARY.VALIDATION_ERROR,
              error: ['email must be an email', 'password is not strong enough'],
            },
          },
          some_fields_missing: {
            value: {
              statusCode: 400,
              message: ERRORS_DICTIONARY.VALIDATION_ERROR,
              error: [
                'last_name must be shorter than or equal to 50 characters',
                'last_name should not be empty',
              ],
            },
          },
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict user info',
    content: {
      'application/json': {
        examples: {
          email_duplication: {
            value: {
              statusCode: 409,
              message: ERRORS_DICTIONARY.EMAIL_EXISTED,
            },
          },
        },
      },
    },
  })
  async signUp(@Body() dto: SignUpDto) {
    return await this.authService.signUp(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiBody({
    type: SignUpDto,
    examples: {
      default_user: {
        value: {
          email: 'alice@gmail.com',
          password: 'abcd1234@@',
        } as SignUpDto,
      },
      error_user: {
        value: {
          email: 'michaelsmith@example.com',
          password: '1232@asdS',
        } as SignUpDto,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Sign in successfully!!',
    content: {
      'application/json': {
        example: {
          accessToken: 'token',
          refreshToken: 'token',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Wrong credentials!!',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: ERRORS_DICTIONARY.WRONG_CREDENTIALS,
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async signIn(@Req() request: RequestWithUser) {
    return await this.authService.signIn(request.user._id.toString());
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('token')
  @ApiResponse({
    status: 200,
    description: 'Create new access token successfully!!',
    content: {
      'application/json': {
        example: {
          accessToken: 'token',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized!!',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      },
    },
  })
  async refreshAccessToken(@Req() request: RequestWithUser) {
    const accessToken = this.authService.generateAccessToken({
      user_id: request.user._id.toString(),
      token_id: request['tokenId'],
    });
    return {
      accessToken,
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('token')
  @ApiQuery({
    name: 'all_device',
    type: Boolean,
    required: false,
  })
  async logOut(
    @Req() request: RequestWithUser,
    @Query('all_device', new ParseBoolPipe({ optional: true })) allDevice?: boolean,
  ) {
    await this.authService.logOut(
      request.user._id.toString(),
      request['tokenId'],
      allDevice,
    );
  }
}
