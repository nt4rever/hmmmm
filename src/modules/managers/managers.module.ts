import { UserAreasModule } from '@modules/user-areas/user-areas.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';

@Module({
  imports: [UsersModule, UserAreasModule],
  controllers: [ManagersController],
  providers: [ManagersService],
})
export class ManagersModule {}
