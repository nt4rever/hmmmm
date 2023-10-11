import { applyDecorators } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation } from '@nestjs/swagger';

export function CreateVolunteerDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Area manager create volunteer',
    }),
    ApiNoContentResponse(),
  );
}
