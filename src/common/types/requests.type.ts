import { User } from '@modules/users/entities';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}
