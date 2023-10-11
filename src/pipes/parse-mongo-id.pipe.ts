import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { PipeTransform, UnprocessableEntityException } from '@nestjs/common';
import { ObjectId, isObjectIdOrHexString } from 'mongoose';

export class ParseMongoIdPipe implements PipeTransform<any, ObjectId[]> {
  transform(value: any): ObjectId[] {
    if (isObjectIdOrHexString(value)) {
      return value;
    }

    throw new UnprocessableEntityException(ERRORS_DICTIONARY.INVALID_ID);
  }
}
