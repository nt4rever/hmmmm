import { PaginationDto } from '@/common/dto';
import { RequestWithUser } from '@/common/types';
import { PagingSerialization } from '@/decorators/api-paging.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { PaginationPagingPipe } from '@/pipes/pagination-paging.pipe';
import { ParseMongoIdPipe } from '@/pipes/parse-mongo-id.pipe';
import { ParseOrderPipe } from '@/pipes/parse-order.pipe';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAccessTokenGuard, RolesGuard } from '../auth/guards';
import { ManagersService } from '../managers/managers.service';
import { PaginationService } from '../pagination/pagination.service';
import { ROLES, User } from '../users/entities';
import { UserPagingSerialization } from '../users/serializations';
import { UsersService } from '../users/users.service';
import { CreateVolunteerDoc } from './docs';
import { CreateVolunteerDto, UpdateVolunteerDto } from './dto';
import { VolunteersService } from './volunteers.service';

@ApiTags('volunteers')
@ApiBearerAuth('token')
@Controller('volunteers')
@UseGuards(JwtAccessTokenGuard)
export class VolunteersController {
  constructor(
    private readonly volunteersService: VolunteersService,
    private readonly managerService: ManagersService,
    private readonly usersService: UsersService,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @CreateVolunteerDoc()
  @Roles(ROLES.AreaManager)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Body() dto: CreateVolunteerDto, @Req() { user }: RequestWithUser) {
    const manager = await this.managerService.get(user.id);

    await this.usersService.registerUser({
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

  @Get()
  @ApiOperation({
    summary: 'Area manager get all volunteer in their area (with paging)',
  })
  @PagingSerialization(UserPagingSerialization)
  @Roles(ROLES.AreaManager)
  @UseGuards(RolesGuard)
  async all(
    @Query(PaginationPagingPipe()) { page, per_page, limit, offset }: PaginationDto,
    @Query('order', ParseOrderPipe) order: Record<string, any>,
    @Req() { user }: RequestWithUser,
  ) {
    const manager = await this.managerService.get(user.id);

    const count = await this.usersService.count({
      role: ROLES.Volunteer,
      area: manager.area,
    });
    const volunteers = await this.usersService.findAll(
      {
        role: ROLES.Volunteer,
        area: manager.area,
      },
      {
        paging: {
          limit,
          offset,
        },
        order: {
          ...order,
        },
      },
    );

    return this.paginationService.paginate<User>(
      {
        page,
        per_page,
        count,
      },
      volunteers,
    );
  }

  @Patch(':id')
  @Roles(ROLES.AreaManager)
  @ApiOperation({
    summary: 'Admin area update volunteer information (location and is_active)',
  })
  @ApiNoContentResponse()
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateVolunteerDto,
    @Req() { user }: RequestWithUser,
  ) {
    const manager = await this.managerService.get(user.id);
    const volunteer = await this.volunteersService.get(id, manager.area);
    await this.volunteersService.update(volunteer, dto);
  }
}
