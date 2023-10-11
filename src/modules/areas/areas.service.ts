import { Inject, Injectable } from '@nestjs/common';
import { AreasRepositoryInterface } from './interfaces';
import { Area } from './entities';
import { BaseServiceAbstract } from '@/services/base';

@Injectable()
export class AreasService extends BaseServiceAbstract<Area> {
  constructor(
    @Inject('AreasRepositoryInterface')
    private readonly areasRepository: AreasRepositoryInterface,
  ) {
    super(areasRepository);
  }
}
