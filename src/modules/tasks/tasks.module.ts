import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entities';
import { TasksRepository } from '@/repositories/task.repository';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
    forwardRef(() => TicketsModule),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: 'TasksRepositoryInterface',
      useClass: TasksRepository,
    },
  ],
  exports: [TasksService],
})
export class TasksModule {}
