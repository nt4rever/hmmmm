import { registerAs } from '@nestjs/config';

export default registerAs(
  'ticket',
  (): Record<string, any> => ({
    task_expires_at: parseInt(process.env.TASK_EXPIRES_AT, 10) ?? 6,
    max_task: parseInt(process.env.MAX_TASK_ASSIGN, 10) ?? 3,
  }),
);
