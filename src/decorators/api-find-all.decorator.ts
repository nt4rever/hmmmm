import { Type, applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';

export function ApiFindAllResponse(model: Type, queryExample: string = 'name|address') {
  return applyDecorators(
    ApiQuery({
      name: 'select',
      type: 'string',
      required: false,
      example: queryExample,
    }),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              count: {
                type: 'number',
                example: 10,
              },
            },
          },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
}
