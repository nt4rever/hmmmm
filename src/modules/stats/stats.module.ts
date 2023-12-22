import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { TicketsModule } from '../tickets/tickets.module';
import { TasksModule } from '../tasks/tasks.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [TicketsModule, TasksModule, CommentsModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
