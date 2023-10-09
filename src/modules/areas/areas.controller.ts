import { ApiFindAllResponse } from '@decorators/api-find-all.decorator';
import { Public } from '@decorators/auth.decorator';
import { Roles } from '@decorators/roles.decorator';
import MongooseClassSerializerInterceptor from '@interceptors/mongoose-class-serializer.interceptor';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { ROLES } from '@modules/users/entities';
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseFieldsPipe } from '@pipes/parse-fields.pipe';
import { ParseMongoIdPipe } from '@pipes/parse-mongo-id.pipe';
import { MONGO_ORDER } from '@repositories/constants/order';
import { AreasService } from './areas.service';
import { CreateAreaDto, UpdateAreaDto } from './dto';
import { Area } from './entities';

@Controller('areas')
@ApiTags('areas')
@ApiBearerAuth('token')
@UseInterceptors(MongooseClassSerializerInterceptor(Area))
@UseGuards(JwtAccessTokenGuard)
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  @ApiOperation({
    summary: 'Public API',
  })
  @ApiFindAllResponse(Area)
  @Public()
  async all(@Query('select', ParseFieldsPipe) projection: string | object) {
    return await this.areasService.findAll(
      {
        is_active: true,
      },
      projection,
      {
        sort: {
          name: MONGO_ORDER.ASC,
        },
      },
    );
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
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateAreaDto) {
    await this.areasService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Admin update area',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(ROLES.Admin, ROLES.AreaManager)
  @UseGuards(RolesGuard)
  async update(@Body() dto: UpdateAreaDto, @Param('id', ParseMongoIdPipe) id: string) {
    await this.areasService.update(id, dto);
  }
}
