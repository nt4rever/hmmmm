import {
  ClassSerializerInterceptor,
  SerializeOptions,
  Type,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

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
