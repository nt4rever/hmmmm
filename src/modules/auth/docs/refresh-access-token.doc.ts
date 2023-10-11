import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function RefreshAccessTokenDoc() {
  return applyDecorators(
    ApiBearerAuth('token'),
    ApiResponse({
      status: 200,
      description: 'Create new access token successfully!!',
      content: {
        'application/json': {
          example: {
            accessToken: 'token',
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized!!',
      content: {
        'application/json': {
          example: {
            statusCode: 401,
            message: 'Unauthorized',
          },
        },
      },
    }),
  );
}
