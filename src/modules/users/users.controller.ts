import { PaginationDto } from '@common/dto';
import { ApiImageFile } from '@decorators/api-file.decorator';
import { PagingSerialization } from '@decorators/api-paging.decorator';
import { Roles } from '@decorators/roles.decorator';
import { PaginateResponse, RequestWithUser } from '@common/types';
import { DocumentSerialization } from '@decorators/document.decorator';
import { JwtAccessTokenGuard, RolesGuard } from '@modules/auth/guards';
import { PaginationService } from '@modules/pagination/pagination.service';
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
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationPagingPipe } from '@pipes/pagination-paging.pipe';
import { ParseFilePipe } from '@pipes/parse-file.pipe';
import { ParseMongoIdPipe } from '@pipes/parse-mongo-id.pipe';
import { UpdateUserDto } from './dto';
import { ROLES, User } from './entities';
import { UserGetSerialization, UserPagingSerialization } from './serializations';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('token')
@UseGuards(JwtAccessTokenGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly paginationService: PaginationService,
  ) {}

  @Get('/me')
  @ApiOperation({
    summary: 'Get profile current user',
  })
  @DocumentSerialization(UserGetSerialization)
  me(@Req() { user }: RequestWithUser) {
    return user;
  }

  @Get(':id')
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  @DocumentSerialization(UserGetSerialization)
  find(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Get()
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  @PagingSerialization(UserPagingSerialization)
  async all(
    @Query(PaginationPagingPipe()) { page, per_page, limit, offset }: PaginationDto,
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

    return this.paginationService.paginate<User>(
      {
        page,
        per_page,
        count,
      },
      users,
    );
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
