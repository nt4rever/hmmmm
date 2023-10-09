import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiFindAllResponse(select = 'name|address', order = 'name|asc') {
  return applyDecorators(
    ApiQuery({
      name: 'select',
      type: 'string',
      required: false,
      example: select,
    }),
    ApiQuery({
      name: 'order',
      type: 'string',
      required: false,
      example: order,
    }),
  );
}
