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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParseMongoIdPipe } from '@pipes/parse-mongo-id.pipe';
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
  async all() {
    return await this.areasService.findAll({
      is_active: true,
    });
  }

  @Post()
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateAreaDto) {
    return await this.areasService.create(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  async update(@Body() dto: UpdateAreaDto, @Param('id', ParseMongoIdPipe) id: string) {
    return await this.areasService.update(id, dto);
  }
}
