import { BaseEntity } from '@modules/shared/base';
import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
} from '@modules/shared/interfaces/database.interface';
import { BaseRepositoryInterface } from '@repositories/base';
import { ClientSession } from 'mongoose';
import { BaseServiceInterface } from './base.interface.service';

export abstract class BaseServiceAbstract<T extends BaseEntity>
  implements BaseServiceInterface<T>
{
  constructor(private readonly repository: BaseRepositoryInterface<T>) {}

  async create(createDto: T | any): Promise<T> {
    return await this.repository.create(createDto);
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<ClientSession>,
  ): Promise<T[]> {
    return await this.repository.findAll(find, options);
  }

  async findOne(_id: string, options?: IDatabaseFindOneOptions<ClientSession>) {
    return await this.repository.findOneById(_id, options);
  }

  async findOneByCondition(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<ClientSession>,
  ) {
    return await this.repository.findOneByCondition(find, options);
  }

  async count(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions<ClientSession>,
  ): Promise<number> {
    return await this.repository.count(find, options);
  }

  async update(_id: string, updateDto: Partial<T>) {
    return await this.repository.update(_id, updateDto);
  }

  async remove(_id: string) {
    return await this.repository.softDelete(_id);
  }
}
