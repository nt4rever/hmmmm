import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from '@services/base';
import { UserArea } from './entities';
import { UserAreasRepositoryInterface } from './interfaces';

@Injectable()
export class UserAreasService extends BaseServiceAbstract<UserArea> {
  constructor(
    @Inject('UserAreasRepositoryInterface')
    private readonly userAreaRepository: UserAreasRepositoryInterface,
  ) {
    super(userAreaRepository);
  }
}
