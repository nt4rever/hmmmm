import { PopulateOptions } from 'mongoose';

export interface IDatabaseFindAllOptions<T = any>
  extends IPaginationOptions,
    Omit<IDatabaseFindOneOptions<T>, 'order'> {}

export interface IDatabaseFindOneOptions<T = any>
  extends Pick<IPaginationOptions, 'order'> {
  select?: Record<string, boolean | number>;
  join?: PopulateOptions | PopulateOptions[];
  session?: T;
  withDeleted?: boolean;
}

export type IDatabaseGetTotalOptions<T = any> = Pick<
  IDatabaseFindOneOptions<T>,
  'session' | 'withDeleted' | 'join'
>;

export enum ORDER_DIRECTION_TYPE {
  ASC = 'asc',
  DESC = 'desc',
}

export type IPaginationOrder = Record<string, ORDER_DIRECTION_TYPE>;

export interface IPaginationPaging {
  limit: number;
  offset: number;
}

export interface IPaginationOptions {
  paging?: IPaginationPaging;
  order?: IPaginationOrder;
}
