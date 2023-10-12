import { registerAs } from '@nestjs/config';

export default registerAs(
  'aws',
  (): Record<string, any> => ({
    endpoint: process.env.AWS_ENDPOINT,
    credential: {
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
    },
    s3: {
      bucket: process.env.AWS_S3_BUCKET ?? 'hmmmm',
      region: process.env.AWS_S3_REGION,
      baseUrl: `${process.env.AWS_ENDPOINT}/${process.env.AWS_S3_BUCKET}`,
    },
  }),
);
