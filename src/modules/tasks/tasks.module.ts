import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entities';
import { TasksRepository } from '@/repositories/task.repository';
import { TicketsModule } from '../tickets/tickets.module';
import { UsersModule } from '../users/users.module';
import { BullModule } from '@nestjs/bullmq';
import { SendMailProcessor } from './queues/task.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
    forwardRef(() => TicketsModule),
    UsersModule,
    BullModule.registerQueue({
      name: 'mail-task',
      prefix: 'task',
    }),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: 'TasksRepositoryInterface',
      useClass: TasksRepository,
    },
    SendMailProcessor,
  ],
  exports: [TasksService],
})
export class TasksModule {}
