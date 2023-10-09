import { ApiFindAllResponse } from '@decorators/api-find-all.decorator';
import { Public } from '@decorators/auth.decorator';
import { Roles } from '@decorators/roles.decorator';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { ORDER_DIRECTION_TYPE } from '@modules/shared/interfaces';
import { ROLES } from '@modules/users/entities';
import {
  Body,
  ClassSerializerInterceptor,
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
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseFieldsPipe } from '@pipes/parse-fields.pipe';
import { ParseMongoIdPipe } from '@pipes/parse-mongo-id.pipe';
import { ParseOrderPipe } from '@pipes/parse-order.pipe';
import { AreasService } from './areas.service';
import { CreateAreaDto, UpdateAreaDto } from './dto';
import { AreaGetSerialization } from './serializations/area.get.serialization';
import MongooseClassSerializerInterceptor from '@interceptors/mongoose-class-serializer.interceptor';
import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';

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
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    excludePrefixes: ['_'],
    type: AreaGetSerialization,
  })
  @ApiOkResponse({
    type: AreaGetSerialization,
    isArray: true,
  })
  @ApiFindAllResponse()
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
  @UseInterceptors(MongooseClassSerializerInterceptor(AreaGetSerialization))
  @ApiOkResponse({ type: AreaGetSerialization })
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
  @ApiOperation({
    summary: 'Admin create area',
  })
  @ApiBody({
    type: CreateAreaDto,
    examples: {
      area_1: {
        value: {
          name: 'VKU University',
          address: '484 ĐT607, Điện Ngọc, Điện Bàn, Đà Nẵng 550000, Vietnam',
          lat: 15.974597,
          lng: 108.254675,
          radius: 2000,
        },
      },
    },
  })
  @ApiNoContentResponse()
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
    summary: 'Admin delete area',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    if (!(await this.areasService.remove(id))) {
      throw new NotFoundException(ERRORS_DICTIONARY.DELETE_FAIL);
    }
  }
}
