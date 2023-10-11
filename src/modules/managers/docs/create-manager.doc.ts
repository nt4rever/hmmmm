import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiNoContentResponse } from '@nestjs/swagger';

export function CreateManagerDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Admin create Area manager',
    }),
    ApiNoContentResponse(),
  );
}
