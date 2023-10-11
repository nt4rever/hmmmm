import { ClientSession, Model, PopulateOptions } from 'mongoose';
import { BaseRepositoryInterface } from './base.interface.repository';
import {
  IDatabaseFindOneOptions,
  IDatabaseFindAllOptions,
  IDatabaseGetTotalOptions,
} from '@/common/interfaces';
import { BaseEntity } from '@/modules/shared/base';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseRepositoryInterface<T>
{
  protected constructor(private readonly model: Model<T>) {}

  async create(dto: T | any): Promise<T> {
    const createData = await this.model.create(dto);
    return createData;
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<ClientSession>,
  ): Promise<T> {
    const findOne = this.model.findById(_id);

    if (options?.withDeleted) {
      findOne.or([
        {
          deleted_at: { $exists: false },
        },
        {
          deleted_at: { $exists: true },
        },
      ]);
    } else {
      findOne.where('deleted_at').exists(false);
    }

    if (options?.select) {
      findOne.select(options.select);
    }

    if (options?.select) {
      findOne.select(options.select);
    }

    if (options?.join) {
      findOne.populate(options.join as PopulateOptions | PopulateOptions[]);
    }

    if (options?.session) {
      findOne.session(options.session);
    }

    if (options?.order) {
      findOne.sort(options.order);
    }

    return findOne.exec() as any;
  }

  async findOneByCondition(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<ClientSession>,
  ): Promise<T> {
    const findOne = this.model.findOne(find);

    if (options?.withDeleted) {
      findOne.or([
        {
          deleted_at: { $exists: false },
        },
        {
          deleted_at: { $exists: true },
        },
      ]);
    } else {
      findOne.where('deleted_at').exists(false);
    }

    if (options?.select) {
      findOne.select(options.select);
    }

    if (options?.select) {
      findOne.select(options.select);
    }

    if (options?.join) {
      findOne.populate(options.join as PopulateOptions | PopulateOptions[]);
    }

    if (options?.session) {
      findOne.session(options.session);
    }

    if (options?.order) {
      findOne.sort(options.order);
    }

    return findOne.exec() as any;
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<ClientSession>,
  ): Promise<T[]> {
    const findAll = this.model.find(find);

    if (options?.withDeleted) {
      findAll.or([
        {
          deleted_at: { $exists: false },
        },
        {
          deleted_at: { $exists: true },
        },
      ]);
    } else {
      findAll.where('deleted_at').exists(false);
    }

    if (options?.select) {
      findAll.select(options.select);
    }

    if (options?.paging) {
      findAll.limit(options.paging.limit).skip(options.paging.offset);
    }

    if (options?.order) {
      findAll.sort(options.order);
    }

    if (options?.join) {
      findAll.populate(options.join as PopulateOptions | PopulateOptions[]);
    }

    if (options?.session) {
      findAll.session(options.session);
    }

    return findAll.lean() as any;
  }

  async count(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    const count = this.model.countDocuments(find);

    if (options?.withDeleted) {
      count.or([
        {
          deleted_at: { $exists: false },
        },
        {
          deleted_at: { $exists: true },
        },
      ]);
    } else {
      count.where('deleted_at').exists(false);
    }

    if (options?.session) {
      count.session(options.session);
    }

    if (options?.join) {
      count.populate(options.join as PopulateOptions | PopulateOptions[]);
    }

    return count.exec();
  }

  async update(_id: string, dto: Partial<T>): Promise<T> {
    return await this.model.findOneAndUpdate({ _id, deleted_at: null }, dto, {
      new: true,
    });
  }

  async softDelete(_id: string): Promise<boolean> {
    const delete_item = await this.model.findById(_id);
    if (!delete_item) {
      return false;
    }

    return !!(await this.model
      .findByIdAndUpdate<T>(_id, { deleted_at: new Date() })
      .exec());
  }

  async permanentlyDelete(_id: string): Promise<boolean> {
    const delete_item = await this.model.findById(_id);
    if (!delete_item) {
      return false;
    }
    return !!(await this.model.findByIdAndDelete(_id));
  }
}
