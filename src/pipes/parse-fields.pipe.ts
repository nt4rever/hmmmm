import { Injectable, PipeTransform } from '@nestjs/common';
import { isString } from 'class-validator';

@Injectable()
export class ParseFieldsPipe implements PipeTransform {
  transform(value: any) {
    if (isString(value)) {
      const arr = value.trim().split('|');
      return arr.join(' ');
    }
    return {};
  }
}
