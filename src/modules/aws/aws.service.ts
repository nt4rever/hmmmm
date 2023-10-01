import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class AwsService {
  private logger: Logger;
  constructor(private configService: ConfigService) {
    this.logger = new Logger(AwsService.name);
  }

  private bucketName = this.configService.get<string>('AWS_S3_BUCKET');
  private s3 = new S3({
    endpoint: this.configService.get<string>('AWS_ENDPOINT'),
    credentials: {
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    },
    region: this.configService.get<string>('AWS_S3_REGION'),
    forcePathStyle: true,
  });

  async uploadPublicFile(dataBuffer: Buffer, key: string): Promise<string> {
    try {
      const data = await new Upload({
        client: this.s3,
        params: {
          ACL: 'public-read',
          Bucket: this.bucketName,
          Key: key,
          Body: dataBuffer,
        },
      }).done();
      return (
        data['Location'] ??
        `${this.configService.get<string>('AWS_ENDPOINT')}/${this.bucketName}/${key}`
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(key: string) {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
