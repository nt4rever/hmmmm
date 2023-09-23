import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import MongooseClassSerializerInterceptor from '@interceptors/mongoose-class-serializer.interceptor';
import { User } from './entities';
import { faker } from '@faker-js/faker';

@Controller('users')
@ApiTags('users')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @ApiBody({
    type: CreateUserDto,
    examples: {
      user_1: {
        value: {
          first_name: 'string',
          last_name: 'string',
          email: faker.internet.email(),
          phone_number: 'string',
          date_of_birth: faker.date.birthdate(),
          password: 'string',
          gender: 'MALE',
        } as CreateUserDto,
      },
      user_2: {
        value: {
          first_name: 'string',
          last_name: 'string',
          email: faker.internet.email(),
          phone_number: 'string',
          date_of_birth: faker.date.birthdate(),
          password: 'string',
          gender: 'OTHER',
        } as CreateUserDto,
      },
    },
  })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
