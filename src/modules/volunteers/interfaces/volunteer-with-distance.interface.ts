import { User } from '@/modules/users/entities';

export type VolunteerWithDistance = User & {
  distance: number;
};
