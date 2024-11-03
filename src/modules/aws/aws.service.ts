import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { randomUUID } from 'crypto';
import { resizedImage } from '@/utils/resizeImage';

@Injectable()
export class AwsService {
  private logger: Logger;
  constructor(private configService: ConfigService) {
    this.logger = new Logger(AwsService.name);
  }

  private bucketName = this.configService.get<string>('aws.s3.bucket');
  private s3 = new S3({
    endpoint: this.configService.get<string>('aws.endpoint'),
    credentials: {
      accessKeyId: this.configService.get<string>('aws.credential.key'),
      secretAccessKey: this.configService.get<string>('aws.credential.secret'),
    },
    region: this.configService.get<string>('aws.s3.region'),
    forcePathStyle: true,
  });

  async uploadPublicFile(dataBuffer: Buffer, key: string): Promise<string> {
    try {
      await new Upload({
        client: this.s3,
        params: {
          ACL: 'public-read',
          Bucket: this.bucketName,
          Key: key,
          Body: dataBuffer,
        },
      }).done();
      return `${this.configService.get<string>('aws.s3.baseUrl')}/${key}`;
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

  async uploadMultipleFile(folderName: string, files: Express.Multer.File[]) {
    try {
      const listUpload = files.map(async (file) => {
        const key = `${folderName}/${randomUUID()}.${file.originalname
          .split('.')
          .at(-1)}`;
        const imageResized = await resizedImage(Buffer.from(file.buffer), {
          width: 500,
          height: 500,
        });
        return this.uploadPublicFile(imageResized, key);
      });

      return await Promise.all(listUpload);
    } catch (error) {
      throw error;
    }
  }
}
