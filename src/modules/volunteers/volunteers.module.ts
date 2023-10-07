import { Module } from '@nestjs/common';
import { VolunteersService } from './volunteers.service';
import { VolunteersController } from './volunteers.controller';
import { UsersModule } from '@modules/users/users.module';
import { AreasModule } from '@modules/areas/areas.module';
import { UserAreasModule } from '@modules/user-areas/user-areas.module';

@Module({
  imports: [UsersModule, AreasModule, UserAreasModule],
  controllers: [VolunteersController],
  providers: [VolunteersService],
})
export class VolunteersModule {}
