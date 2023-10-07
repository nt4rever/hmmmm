import { RequestWithUser } from '@custom-types/requests.type';
import { ApiFindAllResponse } from '@decorators/api-find-all.decorator';
import { Roles } from '@decorators/roles.decorator';
import MongooseClassSerializerInterceptor from '@interceptors/mongoose-class-serializer.interceptor';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { UserAreasService } from '@modules/user-areas/user-areas.service';
import { ROLES, User } from '@modules/users/entities';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseFieldsPipe } from '@pipes/parse-fields.pipe';
import { CreateVolunteerDto } from './dto';
import { VolunteersService } from './volunteers.service';

@ApiTags('volunteers')
@ApiBearerAuth('token')
@Controller('volunteers')
@UseGuards(JwtAccessTokenGuard)
export class VolunteersController {
  constructor(
    private readonly volunteersService: VolunteersService,
    private readonly userAreasService: UserAreasService,
  ) {}

  @Post('manager')
  @ApiOperation({
    summary: 'Area manager create new volunteer',
  })
  @Roles(ROLES.AreaManager)
  @UseGuards(RolesGuard)
  @ApiNoContentResponse()
  async create(@Body() dto: CreateVolunteerDto) {
    await this.userAreasService.createUser(dto, ROLES.Volunteer);
  }

  @Get('manager')
  @ApiOperation({
    summary: 'Area manager gets all the volunteers in their area',
  })
  @ApiFindAllResponse(User, 'first_name|last_name')
  @Roles(ROLES.AreaManager)
  @UseGuards(RolesGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @SerializeOptions({
    excludePrefixes: ['vote_per_day', 'deleted_at'],
  })
  async getVolunteer(
    @Query('select', ParseFieldsPipe) projection: string | object,
    @Req() { user }: RequestWithUser,
  ) {
    return await this.volunteersService.getVolunteersByManager(user, projection);
  }
}
