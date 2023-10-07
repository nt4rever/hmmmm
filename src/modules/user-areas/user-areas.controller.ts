import MongooseClassSerializerInterceptor from '@interceptors/mongoose-class-serializer.interceptor';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParseMongoIdPipe } from '@pipes/parse-mongo-id.pipe';
import { UserArea } from './entities';
import { UserAreasService } from './user-areas.service';

@ApiTags('user-areas')
@Controller('user-areas')
@ApiBearerAuth('token')
@UseInterceptors(MongooseClassSerializerInterceptor(UserArea))
@UseGuards(JwtAccessTokenGuard)
export class UserAreasController {
  constructor(private readonly userAreasService: UserAreasService) {}

  @Get(':id')
  async get(@Param('id', ParseMongoIdPipe) id: string) {
    return await this.userAreasService.findOne(id);
  }

  @Get()
  async findAll() {
    return await this.userAreasService.findAll();
  }
}
