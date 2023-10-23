import { BaseServiceAbstract } from '@/services/base';
import { Inject, Injectable } from '@nestjs/common';
import { Task } from './entities';
import { TasksRepositoryInterface } from './interfaces';

@Injectable()
export class TasksService extends BaseServiceAbstract<Task> {
  constructor(
    @Inject('TasksRepositoryInterface')
    private readonly tasksRepository: TasksRepositoryInterface,
  ) {
    super(tasksRepository);
  }
}
