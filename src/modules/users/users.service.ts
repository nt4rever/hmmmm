import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities';
import { UsersRepositoryInterface } from './interfaces';
import { BaseServiceAbstract } from '@services/base';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UsersRepositoryInterface,
  ) {
    super(usersRepository);
  }
}
