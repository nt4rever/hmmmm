import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiNoContentResponse, ApiOperation } from '@nestjs/swagger';
import { CreateAreaDto } from '../dto';

export function CreateAreaDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Admin create area',
    }),
    ApiBody({
      type: CreateAreaDto,
      examples: {
        area_1: {
          value: {
            name: 'VKU University',
            address: '484 ĐT607, Điện Ngọc, Điện Bàn, Đà Nẵng 550000, Vietnam',
            lat: 15.974597,
            lng: 108.254675,
            radius: 2000,
          },
        },
      },
    }),
    ApiNoContentResponse(),
  );
}
