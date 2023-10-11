import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Area } from '../areas/entities';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { UpdateVolunteerDto } from './dto';
import { User } from '../users/entities';

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
}
