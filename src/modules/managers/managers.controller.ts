import { FindAllSerialization } from '@/decorators/api-find-all.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { ParseMongoIdPipe } from '@/pipes/parse-mongo-id.pipe';
import { ParseOrderPipe } from '@/pipes/parse-order.pipe';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AreasService } from '../areas/areas.service';
import { JwtAccessTokenGuard, RolesGuard } from '../auth/guards';
import { ROLES } from '../users/entities';
import { UserGetSerialization } from '../users/serializations';
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
    const area = await this.areasService.get(dto.area_id);

    await this.userService.registerUser({
      ...dto,
      role: ROLES.AreaManager,
      area,
    });
  }

  @Get('area/:id')
  @FindAllSerialization({
    classToIntercept: UserGetSerialization,
  })
  @ApiOperation({
    summary: 'Admin get all area manager belong to area',
  })
  @ApiQuery({
    name: 'order',
    type: 'string',
    required: false,
    example: 'last_name|asc',
  })
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  async managerOfArea(
    @Param('id', ParseMongoIdPipe) areaId: string,
    @Query('order', ParseOrderPipe) order: Record<string, any>,
  ) {
    const area = await this.areasService.get(areaId);

    return await this.userService.findAll(
      {
        area,
        role: ROLES.AreaManager,
      },
      {
        order: {
          ...order,
        },
      },
    );
  }
}
