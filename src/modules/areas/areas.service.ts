import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AreasRepositoryInterface } from './interfaces';
import { Area } from './entities';
import { BaseServiceAbstract } from '@/services/base';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';

@Injectable()
export class AreasService extends BaseServiceAbstract<Area> {
  constructor(
    @Inject('AreasRepositoryInterface')
    private readonly areasRepository: AreasRepositoryInterface,
  ) {
    super(areasRepository);
  }

  async get(id: string) {
    try {
      const area = await this.findOneByCondition({
        _id: id,
        is_active: true,
      });

      if (!area) throw new NotFoundException(ERRORS_DICTIONARY.AREA_NOT_FOUND);

      return area;
    } catch (error) {
      throw error;
    }
  }
}
