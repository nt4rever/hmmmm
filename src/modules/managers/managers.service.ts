import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class ManagersService {
  constructor(private readonly userService: UsersService) {}

  async get(id: string) {
    try {
      const manager = await this.userService.findOneByCondition(
        {
          _id: id,
          is_active: true,
        },
        {
          join: {
            path: 'area',
            match: {
              is_active: true,
              deleted_at: {
                $exists: false,
              },
            },
          },
        },
      );

      if (!manager || !manager.area?.is_active) {
        throw new NotFoundException(ERRORS_DICTIONARY.USER_NOT_FOUND);
      }

      return manager;
    } catch (error) {
      throw error;
    }
  }
}
