import { FindAllSerialization } from '@/decorators/api-find-all.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { ParseMongoIdPipe } from '@/pipes/parse-mongo-id.pipe';
import { ParseOrderPipe } from '@/pipes/parse-order.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AreasService } from '../areas/areas.service';
import { JwtAccessTokenGuard, RolesGuard } from '../auth/guards';
import { ROLES } from '../users/entities';
import { UserGetSerialization } from '../users/serializations';
import { UsersService } from '../users/users.service';
import { CreateManagerDoc } from './docs';
import { CreateManagerDto, UpdateManagerDto } from './dto';
import { ManagersService } from './managers.service';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { DocumentSerialization } from '@/decorators/document.decorator';

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
    isArray: true,
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

  @Get(':id')
  @DocumentSerialization(UserGetSerialization)
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  async detail(@Param('id', ParseMongoIdPipe) id: string) {
    const manager = await this.userService.findOneByCondition({
      _id: id,
      role: ROLES.AreaManager,
    });

    if (!manager) {
      throw new NotFoundException(ERRORS_DICTIONARY.USER_NOT_FOUND);
    }

    return manager;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin update area manager' })
  @ApiNoContentResponse()
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id', ParseMongoIdPipe) id: string, @Body() dto: UpdateManagerDto) {
    const manager = await this.userService.findOneByCondition({
      _id: id,
      role: ROLES.AreaManager,
    });

    if (!manager) {
      throw new NotFoundException(ERRORS_DICTIONARY.USER_NOT_FOUND);
    }

    await this.userService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin soft delete area manager' })
  @ApiNoContentResponse()
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    const manager = await this.userService.findOneByCondition({
      _id: id,
      role: ROLES.AreaManager,
    });

    if (!manager) {
      throw new NotFoundException(ERRORS_DICTIONARY.USER_NOT_FOUND);
    }

    if (!(await this.userService.remove(id))) {
      throw new NotFoundException(ERRORS_DICTIONARY.DELETE_FAIL);
    }
  }
}
