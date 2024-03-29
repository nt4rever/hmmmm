import { BaseRepositoryInterface } from '@/repositories/base';
import { RefreshToken, User } from '../entities';

export interface UsersRepositoryInterface extends BaseRepositoryInterface<User> {
  addRefreshToken(userId: string, data: RefreshToken): Promise<User>;
  removeRefreshToken(userId: string, id: string, allDevice?: boolean): Promise<User>;
  updateRefreshToken(userId: string, id: string): Promise<User>;
  removeTokenExpires(): Promise<void>;
}
