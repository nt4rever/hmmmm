import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from 'src/services/base';
import { User } from './entities';
import { UsersRepositoryInterface } from './interfaces';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UsersRepositoryInterface,
  ) {
    super(usersRepository);
  }
}
