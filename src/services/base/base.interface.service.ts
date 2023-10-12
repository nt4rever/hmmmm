import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
} from '@/common/interfaces';
import { ClientSession } from 'mongoose';

export interface Write<T> {
  create(item: T | any): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  remove(id: string): Promise<boolean>;
  hardRemove(id: string): Promise<boolean>;
}

export interface Read<T> {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<ClientSession>,
  ): Promise<T[]>;
  findOne(_id: string, options?: IDatabaseFindOneOptions<ClientSession>): Promise<T>;
  findOneByCondition(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<ClientSession>,
  ): Promise<T>;
  count(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions<ClientSession>,
  ): Promise<number>;
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {}
