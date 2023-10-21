import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiNoContentResponse } from '@nestjs/swagger';

export function CreateTicketDoc() {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          area_id: {
            type: 'string',
          },
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          lat: {
            type: 'number',
          },
          lng: {
            type: 'number',
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
