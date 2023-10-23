import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entities';
import { TasksRepository } from '@/repositories/task.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: 'TasksRepositoryInterface',
      useClass: TasksRepository,
    },
  ],
})
export class TasksModule {}
