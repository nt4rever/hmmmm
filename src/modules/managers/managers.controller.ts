import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ManagersService } from './managers.service';
import { CreateManagerDto } from './dto';
import { AreasService } from '@modules/areas/areas.service';
import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';
import { UsersService } from '@modules/users/users.service';
import { ROLES } from '@modules/users/entities';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';

@Controller('managers')
@ApiTags('managers')
@ApiBearerAuth('token')
@UseGuards(JwtAccessTokenGuard)
export class ManagersController {
  constructor(
    private readonly managersService: ManagersService,
    private readonly areasService: AreasService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Admin create Area manager',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateManagerDto) {
    const area = await this.areasService.findOneByCondition({
      _id: dto.area_id,
      is_active: true,
    });

    if (!area) throw new NotFoundException(ERRORS_DICTIONARY.AREA_NOT_FOUND);

    await this.userService.registerUser({
      ...dto,
      role: ROLES.AreaManager,
      area,
    });
  }
}
