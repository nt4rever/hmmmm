import { Injectable, PipeTransform } from '@nestjs/common';
import { isString } from 'class-validator';

@Injectable()
export class ParseFieldsPipe implements PipeTransform {
  transform(value: any) {
    let fields: Record<string, any> = {};
    if (isString(value)) {
      value
        .trim()
        .split('|')
        .map((f) => {
          fields = { ...fields, [f]: 1 };
        });
    }
    return fields;
  }
}
