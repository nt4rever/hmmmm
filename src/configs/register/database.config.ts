import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  (): Record<string, any> => ({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    uri: process.env.DATABASE_URI,
    name: process.env.DATABASE_NAME,
  }),
);
