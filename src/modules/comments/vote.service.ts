import { BaseServiceAbstract } from '@/services/base';
import { Vote } from './entities';
import { Inject, Injectable } from '@nestjs/common';
import { VotesRepositoryInterface } from './interfaces';

@Injectable()
export class VotesService extends BaseServiceAbstract<Vote> {
  constructor(
    @Inject('VotesRepositoryInterface')
    private readonly votesRepository: VotesRepositoryInterface,
  ) {
    super(votesRepository);
  }
}
