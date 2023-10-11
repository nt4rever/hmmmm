import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';

import { Roles } from '@/decorators/roles.decorator';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AreasService } from '../areas/areas.service';
import { JwtAccessTokenGuard, RolesGuard } from '../auth/guards';
import { ROLES } from '../users/entities';
import { UsersService } from '../users/users.service';
import { CreateManagerDoc } from './docs';
import { CreateManagerDto } from './dto';
import { ManagersService } from './managers.service';

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
  @CreateManagerDoc()
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
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
