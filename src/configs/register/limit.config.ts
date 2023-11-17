import { registerAs } from '@nestjs/config';

export default registerAs(
  'limit',
  (): Record<string, any> => ({
    vote_per_day: parseInt(process.env.VOTE_PER_DAY, 10) || 10,
    ticket_per_day: parseInt(process.env.TICKET_PER_DAY, 10) || 10,
  }),
);
