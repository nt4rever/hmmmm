import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';
import { RequestWithUser } from '@custom-types/requests.type';
import { faker } from '@faker-js/faker';
import { GENDER } from '@modules/users/entities';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';

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
              access_token: 'token',
              refresh_token: 'token',
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
          access_token: 'token',
          refresh_token: 'token',
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
          access_token: 'token',
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
    const { user } = request;
    const access_token = this.authService.generateAccessToken({
      user_id: user._id.toString(),
    });
    return {
      access_token,
    };
  }
}
