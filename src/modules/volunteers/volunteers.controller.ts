import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
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
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { VolunteersService } from './volunteers.service';
import { UsersService } from '@modules/users/users.service';
import { CreateVolunteerDto } from './dto';
import { RequestWithUser } from '@custom-types/requests.type';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';
import { ROLES } from '@modules/users/entities';
import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';

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
  @ApiOperation({
    summary: 'Area manager create volunteer',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(ROLES.AreaManager)
  @UseGuards(RolesGuard)
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
    });
  }
}
