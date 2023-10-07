import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';
import { AreasService } from '@modules/areas/areas.service';
import { UserAreasService } from '@modules/user-areas/user-areas.service';
import { ROLES, User } from '@modules/users/entities';
import { UsersService } from '@modules/users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { CreateVolunteerDto } from './dto';

@Injectable()
export class VolunteersService {
  constructor(
    private readonly usersService: UsersService,
    private readonly areasService: AreasService,
    private readonly userAreasService: UserAreasService,
  ) {}

  async create(dto: CreateVolunteerDto) {
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
        role: ROLES.Volunteer,
      });

      await this.userAreasService.create({
        ...dto,
        area,
        user,
      });
    } catch (error) {
      throw error;
    }
  }

  async getVolunteersByManager(user: User, projection?: string | object) {
    try {
      const userArea = await this.userAreasService.findOneByCondition({
        user,
      });
      if (!userArea) {
        throw new NotFoundException(ERRORS_DICTIONARY.AREA_NOT_FOUND);
      }

      const usersInArea = await this.userAreasService.findAll({
        area: userArea.area,
      });
      const userIdsInArea = usersInArea.items.map((u) => u.user.toString());

      return await this.usersService.findAll(
        {
          _id: { $in: userIdsInArea },
          role: ROLES.Volunteer,
        },
        projection,
      );
    } catch (error) {
      throw error;
    }
  }
}
