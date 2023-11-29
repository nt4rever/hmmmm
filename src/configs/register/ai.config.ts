import { registerAs } from '@nestjs/config';

export default registerAs(
  'ai',
  (): Record<string, any> => ({
    endpoint: process.env.AI_ENDPOINT,
    key: process.env.API_KEY,
  }),
);
