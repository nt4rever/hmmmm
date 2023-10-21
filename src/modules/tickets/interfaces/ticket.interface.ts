import { BaseRepositoryInterface } from '@/repositories/base';
import { Ticket } from '../entities';

export interface TicketsRepositoryInterface extends BaseRepositoryInterface<Ticket> {}
