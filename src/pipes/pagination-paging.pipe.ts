import {
  PAGINATION_MAX_PAGE,
  PAGINATION_MAX_PER_PAGE,
  PAGINATION_PAGE,
  PAGINATION_PER_PAGE,
} from '@constraints/pagination.constraint';
import { Injectable, PipeTransform, Scope, Type, mixin } from '@nestjs/common';

export function PaginationPagingPipe(
  defaultPerPage: number = PAGINATION_MAX_PER_PAGE,
): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class MixinPaginationPagingPipe implements PipeTransform {
    async transform(value: Record<string, any>): Promise<Record<string, any>> {
      let page = isNaN(+value?.page) ? PAGINATION_PAGE : +value?.page;
      page = page > PAGINATION_MAX_PAGE ? PAGINATION_MAX_PAGE : page;

      let perPage = isNaN(+value?.perPage) ? PAGINATION_PER_PAGE : +value?.perPage;
      perPage = perPage > defaultPerPage ? defaultPerPage : perPage;

      const offset = (page - 1) * perPage;

      return {
        ...value,
        page,
        perPage,
        limit: perPage,
        offset,
      };
    }
  }

  return mixin(MixinPaginationPagingPipe);
}
