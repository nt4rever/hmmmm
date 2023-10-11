import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SignUpDto } from '../dto';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';

export function SignInDoc() {
  return applyDecorators(
    ApiBody({
      type: SignUpDto,
      examples: {
        admin: {
          value: {
            email: 'admin@hmmmm.tech',
            password: 'abcd1234@@',
          } as SignUpDto,
        },
        manager: {
          value: {
            email: 'manager.007@hmmmm.tech',
            password: 'abcd1234@@',
          } as SignUpDto,
        },
      },
    }),
    ApiResponse({
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
    }),
    ApiUnauthorizedResponse({
      description: 'Wrong credentials!!',
      content: {
        'application/json': {
          example: {
            statusCode: 401,
            message: ERRORS_DICTIONARY.WRONG_CREDENTIALS,
          },
        },
      },
    }),
  );
}
