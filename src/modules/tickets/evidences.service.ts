import { BaseServiceAbstract } from '@/services/base';
import { Inject, Injectable } from '@nestjs/common';
import { Evidence } from './entities';
import { EvidencesRepositoryInterface } from './interfaces';

@Injectable()
export class EvidencesService extends BaseServiceAbstract<Evidence> {
  constructor(
    @Inject('EvidencesRepositoryInterface')
    private readonly evidencesRepository: EvidencesRepositoryInterface,
  ) {
    super(evidencesRepository);
  }
}
