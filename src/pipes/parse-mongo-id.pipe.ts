import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';
import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ObjectId, isObjectIdOrHexString } from 'mongoose';

export class ParseMongoIdPipe implements PipeTransform<any, ObjectId[]> {
  transform(value: any): ObjectId[] {
    if (isObjectIdOrHexString(value)) {
      return value;
    }

    throw new BadRequestException(ERRORS_DICTIONARY.INVALID_ID);
  }
}
