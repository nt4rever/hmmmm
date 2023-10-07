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
import { ApiBearerAuth, ApiBody, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
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
  @Public()
  @ApiFindAllResponse(Area)
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
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
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
  async create(@Body() dto: CreateAreaDto) {
    return await this.areasService.create(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  @ApiNoContentResponse()
  async update(@Body() dto: UpdateAreaDto, @Param('id', ParseMongoIdPipe) id: string) {
    return await this.areasService.update(id, dto);
  }
}
