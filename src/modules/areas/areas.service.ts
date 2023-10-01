import { Inject, Injectable } from '@nestjs/common';
import { AreasRepositoryInterface } from './interfaces';
import { BaseServiceAbstract } from '@services/base';
import { Area } from './entities';

@Injectable()
export class AreasService extends BaseServiceAbstract<Area> {
  constructor(
    @Inject('AreasRepositoryInterface')
    private readonly areasRepository: AreasRepositoryInterface,
  ) {
    super(areasRepository);
  }
}
