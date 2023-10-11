import { Module } from '@nestjs/common';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';
import { AreasModule } from '../areas/areas.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AreasModule, UsersModule],
  controllers: [ManagersController],
  providers: [ManagersService],
  exports: [ManagersService],
})
export class ManagersModule {}
