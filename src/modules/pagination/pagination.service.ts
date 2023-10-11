import { PaginationDto } from '@common/dto';
import { PaginateResponse } from '@common/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  paginate<T>(
    dto: Pick<PaginationDto, 'page' | 'per_page'> & { count: number },
    items: T[],
  ): PaginateResponse<T> {
    const { page, per_page, count } = dto;
    const pageCount = Math.ceil(count / per_page);
    return {
      meta: {
        page,
        per_page,
        item_count: count,
        page_count: pageCount,
        has_next: page < pageCount,
        has_prev: page > 1,
      },
      items,
    };
  }
}
