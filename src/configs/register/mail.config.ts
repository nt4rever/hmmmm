import { registerAs } from '@nestjs/config';

export default registerAs(
  'mail',
  (): Record<string, any> => ({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  }),
);
