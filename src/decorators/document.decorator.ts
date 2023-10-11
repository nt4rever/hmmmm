import MongooseClassSerializerInterceptor from '@/interceptors/mongoose-class-serializer.interceptor';
import { Type, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

export function DocumentSerialization(classToIntercept: Type) {
  return applyDecorators(
    UseInterceptors(MongooseClassSerializerInterceptor(classToIntercept)),
    ApiOkResponse({ type: classToIntercept }),
  );
}
