import { RequestWithUser } from '@common/types/requests.type';
import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';
import { Roles } from '@decorators/roles.decorator';
import { ROLES } from '@modules/users/entities';
import { UsersService } from '@modules/users/users.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotAcceptableException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateVolunteerDoc } from './docs';
import { CreateVolunteerDto } from './dto';
import { VolunteersService } from './volunteers.service';
import { JwtAccessTokenGuard, RolesGuard } from '@modules/auth/guards';

@ApiTags('volunteers')
@ApiBearerAuth('token')
@Controller('volunteers')
@UseGuards(JwtAccessTokenGuard)
export class VolunteersController {
  constructor(
    private readonly volunteersService: VolunteersService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @CreateVolunteerDoc()
  @Roles(ROLES.AreaManager)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Body() dto: CreateVolunteerDto, @Req() { user }: RequestWithUser) {
    const manager = await this.userService.findOneByCondition(
      {
        _id: user.id,
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
      throw new NotAcceptableException(ERRORS_DICTIONARY.CREATE_FAIL);
    }

    await this.userService.registerUser({
      ...dto,
      role: ROLES.Volunteer,
      area: manager.area,
      location: {
        lat: dto.lat,
        lng: dto.lng,
        radius: dto.radius,
      },
    });
  }
}
