import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';
import { UserAreasService } from '@modules/user-areas/user-areas.service';
import { ROLES, User } from '@modules/users/entities';
import { UsersService } from '@modules/users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class VolunteersService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userAreasService: UserAreasService,
  ) {}

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
