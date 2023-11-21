import { BaseServiceAbstract } from '@/services/base';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { TASK_STATUS, Task } from './entities';
import { TasksRepositoryInterface } from './interfaces';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService extends BaseServiceAbstract<Task> {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @Inject('TasksRepositoryInterface')
    private readonly tasksRepository: TasksRepositoryInterface,
  ) {
    super(tasksRepository);
  }

  @Cron(CronExpression.EVERY_6_HOURS, {
    name: 'change-task-status',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleChangeStatus() {
    try {
      this.logger.warn('Schedule change task status is running...');
      await this.tasksRepository.updateMany(
        {
          status: TASK_STATUS.PENDING,
          expires_at: {
            $lt: new Date(),
          },
        },
        {
          status: TASK_STATUS.CANCELED,
        },
      );
      this.logger.warn('Schedule change task status DONE');
    } catch (error) {}
  }
}
