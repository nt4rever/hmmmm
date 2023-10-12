import { registerAs } from '@nestjs/config';

export default registerAs(
  'jwt',
  (): Record<string, any> => ({
    access_private_key: process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
    refresh_private_key: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
    access_expiration_time: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME, 10),
    refresh_expiration_time: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME, 10),
  }),
);
