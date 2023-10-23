import { BaseRepositoryInterface } from '@/repositories/base';
import { Task } from '../entities';

export interface TasksRepositoryInterface extends BaseRepositoryInterface<Task> {}
