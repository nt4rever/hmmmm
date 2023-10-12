import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipe,
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
import { AdminUpdateUserDto, UpdateUserDto } from './dto';
import { ROLES, User } from './entities';
import { UserGetSerialization, UserPagingSerialization } from './serializations';
import { UsersService } from './users.service';
import { PaginationDto } from '@/common/dto';
import { RequestWithUser, PaginateResponse } from '@/common/types';
import { ApiImageFile } from '@/decorators/api-file.decorator';
import { PagingSerialization } from '@/decorators/api-paging.decorator';
import { DocumentSerialization } from '@/decorators/document.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { PaginationPagingPipe } from '@/pipes/pagination-paging.pipe';
import { ParseMongoIdPipe } from '@/pipes/parse-mongo-id.pipe';
import { JwtAccessTokenGuard, RolesGuard } from '../auth/guards';
import { PaginationService } from '../pagination/pagination.service';
import { ParseOrderPipe } from '@/pipes/parse-order.pipe';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import * as argon2 from 'argon2';

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
  @ApiOperation({ summary: 'Admin get detail user' })
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  @DocumentSerialization(UserGetSerialization)
  find(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Admin get all user (with paging)' })
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  @PagingSerialization(UserPagingSerialization)
  async all(
    @Query(PaginationPagingPipe()) { page, per_page, limit, offset }: PaginationDto,
    @Query('order', ParseOrderPipe) order: Record<string, any>,
  ): Promise<PaginateResponse<User>> {
    const count = await this.usersService.count();
    const users = await this.usersService.findAll(
      {},
      {
        paging: {
          limit,
          offset,
        },
        order: {
          ...order,
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

  @Patch(':id')
  @ApiOperation({ summary: 'Admin update user (include password, status)' })
  @ApiNoContentResponse()
  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async adminUpdate(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: AdminUpdateUserDto,
    @Req() request: RequestWithUser,
  ) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(ERRORS_DICTIONARY.USER_NOT_FOUND);
    }

    if (user.id === request.user.id) {
      throw new ConflictException(ERRORS_DICTIONARY.UPDATE_FAIL);
    }

    if (dto.password) {
      const hashedPassword = await argon2.hash(dto.password);
      dto.password = hashedPassword;
    }

    await this.usersService.update(id, dto);
  }
}
