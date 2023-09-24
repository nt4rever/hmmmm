import { MongoExceptionFilter } from '@exception-filters/mongo-exception.filter';
import { faker } from '@faker-js/faker';
import MongooseClassSerializerInterceptor from '@interceptors/mongoose-class-serializer.interceptor';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto';
import { GENDER, User } from './entities';
import { UsersService } from './users.service';
import { ParseMongoIdPipe } from '@pipes/parse-mongo-id.pipe';

@Controller('users')
@ApiTags('users')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
@UseFilters(MongoExceptionFilter)
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

  @Get(':id')
  find(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.findOne(id);
  }
}
