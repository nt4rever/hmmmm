import { BaseEntity } from '@modules/shared/base';
import { BaseServiceInterface } from './base.interface.service';
import { FindAllResponse } from '@custom-types/common.type';
import { BaseRepositoryInterface } from '@repositories/base';

export abstract class BaseServiceAbstract<T extends BaseEntity>
  implements BaseServiceInterface<T>
{
  constructor(private readonly repository: BaseRepositoryInterface<T>) {}

  async create(createDto: T | any): Promise<T> {
    return await this.repository.create(createDto);
  }

  async findAll(
    filter?: object,
    options?: object,
  ): Promise<FindAllResponse<T>> {
    return await this.repository.findAll(filter, options);
  }

  async findOne(id: string) {
    return await this.repository.findOneById(id);
  }

  async findOneByCondition(filter: Partial<T>) {
    return await this.repository.findOneByCondition(filter);
  }

  async update(id: string, updateDto: Partial<T>) {
    return await this.repository.update(id, updateDto);
  }

  async remove(id: string) {
    return await this.repository.softDelete(id);
  }
}
