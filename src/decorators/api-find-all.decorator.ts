import {
  ClassSerializerInterceptor,
  SerializeOptions,
  Type,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';

export function ApiFindAllQuery(select = 'name|address', order = 'name|asc') {
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

interface IFindAllSerialization {
  classToIntercept: Type;
  isArray?: boolean;
  excludePrefixes?: string[];
}

export function FindAllSerialization({
  classToIntercept,
  isArray = false,
  excludePrefixes = ['_'],
}: IFindAllSerialization) {
  return applyDecorators(
    UseInterceptors(ClassSerializerInterceptor),
    SerializeOptions({
      excludePrefixes,
      type: classToIntercept,
    }),
    ApiOkResponse({
      type: classToIntercept,
      isArray,
    }),
  );
}
