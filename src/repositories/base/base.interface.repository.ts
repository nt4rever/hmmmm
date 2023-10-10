import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
} from '@modules/shared/interfaces/database.interface';
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

  softDelete(_id: string): Promise<boolean>;

  permanentlyDelete(_id: string): Promise<boolean>;
}
