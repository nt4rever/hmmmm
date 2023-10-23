import { EVIDENCE_TYPE } from '@/modules/tickets/entities';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function UpdateTaskDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Volunteer update task',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            example:
              'The purpose of this report is to provide an overview of the road surface condition in the city of Redmond, Washington.',
          },
          lat: {
            type: 'number',
            example: 15.974597,
          },
          lng: {
            type: 'number',
            example: 108.254675,
          },
          type: {
            type: 'string',
            enum: [
              EVIDENCE_TYPE.CONFIRMED,
              EVIDENCE_TYPE.REJECTED,
              EVIDENCE_TYPE.TENTATIVE,
            ],
            example: EVIDENCE_TYPE.CONFIRMED,
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
        required: ['content', 'lat', 'lng', 'type', 'images'],
      },
    }),
    ApiNoContentResponse(),
  );
}
