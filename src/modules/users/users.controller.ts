import { RequestWithUser } from '@custom-types/requests.type';
import { ApiImageFile } from '@decorators/api-file.decorator';
import { Roles } from '@decorators/roles.decorator';
import { faker } from '@faker-js/faker';
import MongooseClassSerializerInterceptor from '@interceptors/mongoose-class-serializer.interceptor';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseFilePipe } from '@pipes/parse-file.pipe';
import { ParseMongoIdPipe } from '@pipes/parse-mongo-id.pipe';
import { CreateUserDto, UpdateUserDto } from './dto';
import { GENDER, ROLES, User } from './entities';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('token')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
@UseGuards(JwtAccessTokenGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(ROLES.Admin, ROLES.AreaManager)
  @UseGuards(RolesGuard)
  @Post()
  @ApiBody({
    type: CreateUserDto,
    examples: {
      user_1: {
        value: {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          email: faker.internet.email(),
          phone_number: '+84xxxxxxxxx',
          date_of_birth: new Date('2001-02-14'),
          password: 'password',
          gender: GENDER.Male,
          role: ROLES.Volunteer,
        } as CreateUserDto,
      },
    },
  })
  @ApiOperation({
    summary: 'Admin, Area Manager create new user',
    description: `
* Only admin and area manager can use this API

* Admin create user and give some specific information`,
  })
  create(@Body() dto: CreateUserDto, @Req() { user }: RequestWithUser) {
    return this.usersService.createUser(user, dto);
  }

  @Get('/me')
  @ApiOperation({
    summary: 'Get profile current user',
  })
  me(@Req() { user }: RequestWithUser) {
    return user;
  }

  @Get(':id')
  find(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(ROLES.Admin)
  @UseGuards(RolesGuard)
  @Get()
  all() {
    return this.usersService.findAll();
  }

  @Post('avatar')
  @ApiImageFile('avatar', true)
  @ApiOperation({
    summary: 'Update avatar current user',
  })
  async uploadAvatar(
    @UploadedFile(ParseFilePipe) avatar: Express.Multer.File,
    @Req() { user }: RequestWithUser,
  ) {
    return await this.usersService.uploadAvatar(user, avatar);
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Update profile current user',
  })
  async updateProfile(@Body() dto: UpdateUserDto, @Req() { user }: RequestWithUser) {
    return await this.usersService.update(user.id, dto);
  }
}
