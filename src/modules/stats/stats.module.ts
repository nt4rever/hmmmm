import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { TicketsModule } from '../tickets/tickets.module';
import { TasksModule } from '../tasks/tasks.module';
import { CommentsModule } from '../comments/comments.module';
import { UsersModule } from '../users/users.module';
import { AreasModule } from '../areas/areas.module';

@Module({
  imports: [TicketsModule, TasksModule, CommentsModule, UsersModule, AreasModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
