import { UserAreasModule } from '@modules/user-areas/user-areas.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { VolunteersController } from './volunteers.controller';
import { VolunteersService } from './volunteers.service';

@Module({
  imports: [UsersModule, UserAreasModule],
  controllers: [VolunteersController],
  providers: [VolunteersService],
})
export class VolunteersModule {}
