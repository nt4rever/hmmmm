import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function CreateTicketDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'User create ticket',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          area_id: {
            type: 'string',
            example: '652406606c1818d541f05a49',
          },
          title: {
            type: 'string',
            example:
              'The purpose of this report is to provide an overview of the road surface condition in the city of Redmond, Washington.',
          },
          description: {
            type: 'string',
            example:
              'The purpose of this report is to provide an overview of the road surface condition in the city of Redmond, Washington.',
          },
          lat: {
            type: 'number',
            example: 15.974597,
          },
          lng: {
            type: 'number',
            example: 108.254675,
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
        required: ['area_id', 'title', 'lat', 'lng', 'images'],
      },
    }),
    ApiNoContentResponse(),
  );
}
