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
  ApiTags,
} from '@nestjs/swagger';

import { AreasService } from './areas.service';
import { CreateAreaDoc } from './docs';
import { CreateAreaDto, UpdateAreaDto } from './dto';
import { AreaGetSerialization } from './serializations';
import { ORDER_DIRECTION_TYPE } from '@/common/interfaces';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import {
  FindAllSerialization,
  ApiFindAllQuery,
} from '@/decorators/api-find-all.decorator';
import { Public } from '@/decorators/auth.decorator';
import { DocumentSerialization } from '@/decorators/document.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { ParseFieldsPipe } from '@/pipes/parse-fields.pipe';
import { ParseMongoIdPipe } from '@/pipes/parse-mongo-id.pipe';
import { ParseOrderPipe } from '@/pipes/parse-order.pipe';
import { RolesGuard, JwtAccessTokenGuard } from '../auth/guards';
import { ROLES } from '../users/entities';

@Controller('areas')
@ApiTags('areas')
@ApiBearerAuth('token')
@Roles(ROLES.Admin)
@UseGuards(RolesGuard)
@UseGuards(JwtAccessTokenGuard)
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  @ApiOperation({
    summary: 'Public API',
  })
  @Public()
  @FindAllSerialization({
    classToIntercept: AreaGetSerialization,
    isArray: true,
  })
  @ApiFindAllQuery()
  async all(
    @Query('select', ParseFieldsPipe) fields: Record<string, any>,
    @Query('order', ParseOrderPipe) order: Record<string, any>,
  ) {
    return await this.areasService.findAll(
      {
        is_active: true,
      },
      {
        select: fields,
        order: {
          name: ORDER_DIRECTION_TYPE.ASC,
          ...order,
        },
      },
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Public API',
  })
  @Public()
  @DocumentSerialization(AreaGetSerialization)
  async get(@Param('id', ParseMongoIdPipe) id: string) {
    const area = await this.areasService.findOneByCondition({
      _id: id,
      is_active: true,
    });
    if (!area) {
      throw new NotFoundException(ERRORS_DICTIONARY.AREA_NOT_FOUND);
    }
    return area;
  }

  @Post()
  @CreateAreaDoc()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Body() dto: CreateAreaDto) {
    await this.areasService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Admin update area',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Body() dto: UpdateAreaDto, @Param('id', ParseMongoIdPipe) id: string) {
    await this.areasService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Admin soft delete area',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    if (!(await this.areasService.remove(id))) {
      throw new NotFoundException(ERRORS_DICTIONARY.DELETE_FAIL);
    }
  }
}
