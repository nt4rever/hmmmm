import { ORDER_DIRECTION_TYPE } from '@modules/shared/interfaces/database.interface';
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseOrderPipe implements PipeTransform {
  // name|asc
  transform(value: any) {
    try {
      const [name, direction] = value.trim().split('|');
      return {
        [name]: ORDER_DIRECTION_TYPE[(direction as unknown as string).toUpperCase()],
      };
    } catch (error) {
      return {};
    }
  }
}
