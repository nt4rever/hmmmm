import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from '@modules/shared/interfaces/database.interface';
import { ClientSession } from 'mongoose';

export interface Write<T> {
  create(item: T | any): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  remove(id: string): Promise<boolean>;
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
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {}
