import { Module } from '@nestjs/common';
import { VolunteersController } from './volunteers.controller';
import { VolunteersService } from './volunteers.service';
import { UsersModule } from '../users/users.module';
import { ManagersModule } from '../managers/managers.module';

@Module({
  imports: [UsersModule, ManagersModule],
  controllers: [VolunteersController],
  providers: [VolunteersService],
  exports: [VolunteersService],
})
export class VolunteersModule {}
