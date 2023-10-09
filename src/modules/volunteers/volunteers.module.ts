import { Module } from '@nestjs/common';
import { VolunteersController } from './volunteers.controller';
import { VolunteersService } from './volunteers.service';

@Module({
  imports: [],
  controllers: [VolunteersController],
  providers: [VolunteersService],
})
export class VolunteersModule {}
