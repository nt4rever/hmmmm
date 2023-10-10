import { PaginationListDto } from '@common/dto';
import { PaginateResponse } from '@custom-types/common.type';
import { RequestWithUser } from '@custom-types/requests.type';
import { ApiImageFile } from '@decorators/api-file.decorator';
import { Public } from '@decorators/auth.decorator';
import { Roles } from '@decorators/roles.decorator';
import MongooseClassSerializerInterceptor from '@interceptors/mongoose-class-serializer.interceptor';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationPagingPipe } from '@pipes/pagination-paging.pipe';
import { ParseFilePipe } from '@pipes/parse-file.pipe';
import { ParseMongoIdPipe } from '@pipes/parse-mongo-id.pipe';
import { UpdateUserDto } from './dto';
import { ROLES, User } from './entities';
import { UserGetSerialization } from './serializations';
import { UserPagingSerialization } from './serializations/user.paging.serialization';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('token')
@UseGuards(JwtAccessTokenGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiOperation({
    summary: 'Get profile current user',
  })
  @UseInterceptors(MongooseClassSerializerInterceptor(UserGetSerialization))
  @ApiOkResponse({ type: UserGetSerialization })
  me(@Req() { user }: RequestWithUser) {
    return user;
  }

  @Get(':id')
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(UserGetSerialization))
  @ApiOkResponse({ type: UserGetSerialization })
  find(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Get()
  @Public()
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: UserPagingSerialization,
    excludePrefixes: ['_'],
  })
  async all(
    @Query(PaginationPagingPipe()) { page, perPage, limit, offset }: PaginationListDto,
  ): Promise<PaginateResponse<User>> {
    const count = await this.usersService.count();
    const users = await this.usersService.findAll(
      {},
      {
        paging: {
          limit,
          offset,
        },
      },
    );

    const pageCount = Math.ceil(count / perPage);
    return {
      meta: {
        page,
        perPage,
        itemCount: users.length,
        pageCount,
        hasNext: page < pageCount,
        hasPrev: page > 1,
      },
      items: users,
    };
  }

  @Post('avatar')
  @ApiImageFile('avatar', true)
  @ApiOperation({
    summary: 'Update avatar current user',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async uploadAvatar(
    @UploadedFile(ParseFilePipe) avatar: Express.Multer.File,
    @Req() { user }: RequestWithUser,
  ) {
    await this.usersService.uploadAvatar(user, avatar);
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Update profile current user',
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProfile(@Body() dto: UpdateUserDto, @Req() { user }: RequestWithUser) {
    await this.usersService.update(user.id, dto);
  }
}
