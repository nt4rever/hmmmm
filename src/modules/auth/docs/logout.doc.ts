import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

export function LogoutDoc() {
  return applyDecorators(
    ApiBearerAuth('token'),
    ApiQuery({
      name: 'all_device',
      type: Boolean,
      required: false,
    }),
  );
}
