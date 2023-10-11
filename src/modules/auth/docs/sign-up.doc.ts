import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { SignUpDto } from '../dto';

export function SignUpDoc() {
  return applyDecorators(
    ApiBody({
      type: SignUpDto,
      examples: {
        admin: {
          value: {
            last_name: 'Admin',
            email: 'admin@hmmmm.tech',
            password: 'abcd1234@@',
          } as SignUpDto,
        },
        user: {
          value: {
            last_name: 'user 007',
            email: 'user.007@hmmmm.tech',
            password: 'abcd1234@@',
          } as SignUpDto,
        },
      },
    }),
    ApiCreatedResponse({
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
    }),
    ApiUnprocessableEntityResponse({
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
    }),
    ApiConflictResponse({
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
    }),
  );
}
