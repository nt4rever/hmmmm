import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { Injectable, NotFoundException } from '@nestjs/common';
import { getDistance } from 'geolib';
import { Area } from '../areas/entities';
import { Location } from '../shared/base';
import { ROLES, User } from '../users/entities';
import { UsersService } from '../users/users.service';
import { UpdateVolunteerDto } from './dto';
import { VolunteerWithDistance } from './interfaces';

@Injectable()
export class VolunteersService {
  constructor(private readonly usersService: UsersService) {}

  async get(id: string, area: Area) {
    try {
      const volunteer = await this.usersService.findOneByCondition({
        _id: id,
        area,
      });

      if (!volunteer) {
        throw new NotFoundException(ERRORS_DICTIONARY.USER_NOT_FOUND);
      }

      return volunteer;
    } catch (error) {
      throw error;
    }
  }

  async update(user: User, dto: UpdateVolunteerDto) {
    try {
      await this.usersService.update(user.id, {
        is_active: dto.is_active ?? user.is_active,
        location: {
          lat: dto.lat ?? user.location?.lat,
          lng: dto.lng ?? user.location?.lng,
          radius: dto.radius ?? user.location?.radius,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getVolunteerWithDistance(area: Area, location: Location) {
    try {
      // Get a list of volunteers in this area
      const volunteers = await this.usersService.findAll({
        area,
        is_active: true,
        role: ROLES.Volunteer,
      });

      // Calculate the distance between the location of the report and the location of the volunteer
      const volunteersWithDistance: VolunteerWithDistance[] = volunteers.map((v) => {
        const distance = getDistance(
          {
            lat: v.location.lat,
            lng: v.location.lng,
          },
          {
            lat: location.lat,
            lng: location.lng,
          },
        );
        return {
          ...v,
          distance,
        };
      });

      // Sort by distance descending
      volunteersWithDistance.sort((a, b) => a.distance - b.distance);
      return volunteersWithDistance;
    } catch (error) {
      throw error;
    }
  }
}
