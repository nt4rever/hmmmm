import { Roles } from '@decorators/roles.decorator';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { UserAreasService } from '@modules/user-areas/user-areas.service';
import { ROLES } from '@modules/users/entities';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateManagerDto } from './dto';
import { ManagersService } from './managers.service';

@Controller('managers')
@ApiTags('managers')
@ApiBearerAuth('token')
@UseGuards(JwtAccessTokenGuard)
export class ManagersController {
  constructor(
    private readonly managersService: ManagersService,
    private readonly userAreasService: UserAreasService,
  ) {}

  @Post()
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateManagerDto) {
    await this.userAreasService.createUser(dto, ROLES.AreaManager);
  }
}
