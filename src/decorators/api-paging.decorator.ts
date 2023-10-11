import {
  ClassSerializerInterceptor,
  SerializeOptions,
  Type,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';

export function PagingSerialization(classToIntercept: Type) {
  return applyDecorators(
    UseInterceptors(ClassSerializerInterceptor),
    SerializeOptions({
      type: classToIntercept,
      excludePrefixes: ['_'],
    }),
    ApiOkResponse({
      type: classToIntercept,
    }),
    ApiQuery({
      name: 'order',
      type: 'string',
      required: false,
      example: 'id|asc',
    }),
  );
}
