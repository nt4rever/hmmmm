import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';
import { AreasService } from '@modules/areas/areas.service';
import { CreateManagerDto } from '@modules/managers/dto';
import { ROLES } from '@modules/users/entities';
import { UsersService } from '@modules/users/users.service';
import { CreateVolunteerDto } from '@modules/volunteers/dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BaseServiceAbstract } from '@services/base';
import * as argon2 from 'argon2';
import { UserArea } from './entities';
import { UserAreasRepositoryInterface } from './interfaces';

@Injectable()
export class UserAreasService extends BaseServiceAbstract<UserArea> {
  constructor(
    @Inject('UserAreasRepositoryInterface')
    private readonly userAreaRepository: UserAreasRepositoryInterface,
    private readonly usersService: UsersService,
    private readonly areasService: AreasService,
  ) {
    super(userAreaRepository);
  }

  async createUser(dto: CreateManagerDto | CreateVolunteerDto, role: ROLES) {
    try {
      const area = await this.areasService.findOneByCondition({
        _id: dto.area_id,
        is_active: true,
      });
      if (!area) {
        throw new NotFoundException(ERRORS_DICTIONARY.AREA_NOT_FOUND);
      }
      const hash = await argon2.hash(dto.password);
      const user = await this.usersService.create({
        ...dto,
        password: hash,
        role,
      });
      await this.create({
        ...dto,
        area,
        user,
      });
    } catch (error) {
      throw error;
    }
  }
}
