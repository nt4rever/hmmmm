import {
  IDatabaseFindOneOptions,
  IDatabaseFindAllOptions,
  IDatabaseGetTotalOptions,
} from '@/common/interfaces';
import { ClientSession } from 'mongoose';

export interface BaseRepositoryInterface<T> {
  create(dto: T | any): Promise<T>;

  findOneById(_id: string, options?: IDatabaseFindOneOptions<ClientSession>): Promise<T>;

  findOneByCondition(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<ClientSession>,
  ): Promise<T>;

  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<ClientSession>,
  ): Promise<T[]>;

  count(find?: Record<string, any>, options?: IDatabaseGetTotalOptions): Promise<number>;

  update(_id: string, dto: Partial<T>): Promise<T>;

  updateMany(find: Record<string, any>, dto: Partial<T>): Promise<void>;

  softDelete(_id: string): Promise<boolean>;

  permanentlyDelete(_id: string): Promise<boolean>;
}
