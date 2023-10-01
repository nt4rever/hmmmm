import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities';
import { UsersRepository } from '@repositories/users.repository';
import { AwsModule } from '@modules/aws/aws.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    AwsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
