import { Module } from '@nestjs/common';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';
import { AreasModule } from '@modules/areas/areas.module';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [AreasModule, UsersModule],
  controllers: [ManagersController],
  providers: [ManagersService],
})
export class ManagersModule {}
