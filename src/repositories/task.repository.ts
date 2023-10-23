import { Task, TaskDocument } from '@/modules/tasks/entities';
import { BaseRepositoryAbstract } from './base';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TasksRepositoryInterface } from '@/modules/tasks/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksRepository
  extends BaseRepositoryAbstract<TaskDocument>
  implements TasksRepositoryInterface
{
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {
    super(taskModel);
  }
}
