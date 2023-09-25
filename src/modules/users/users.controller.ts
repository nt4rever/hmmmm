import { MongoExceptionFilter } from '@exception-filters/mongo-exception.filter';
import { faker } from '@faker-js/faker';
import MongooseClassSerializerInterceptor from '@interceptors/mongoose-class-serializer.interceptor';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto';
import { GENDER, User } from './entities';
import { UsersService } from './users.service';
import { ParseMongoIdPipe } from '@pipes/parse-mongo-id.pipe';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RequestWithUser } from '@custom-types/requests.type';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('token')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
@UseFilters(MongoExceptionFilter)
@UseGuards(JwtAccessTokenGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
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
          date_of_birth: faker.date.birthdate(),
          password: 'password',
          gender: GENDER.Male,
        } as CreateUserDto,
      },
    },
  })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get('/me')
  me(@Req() { user }: RequestWithUser) {
    return user;
  }

  @Get(':id')
  find(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.findOne(id);
  }
}
