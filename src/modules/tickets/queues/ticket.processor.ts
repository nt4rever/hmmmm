/* eslint-disable @typescript-eslint/no-unused-vars */
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { TicketsService } from '../tickets.service';

@Processor('image:upload')
export class UploadImageProcessor extends WorkerHost {
  private logger = new Logger(UploadImageProcessor.name);

  constructor(private readonly ticketsService: TicketsService) {
    super();
  }

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    switch (job.name) {
      case 'upload-image':
        try {
          const imageUrls = await this.ticketsService.uploadImages(
            job.data.ticketId,
            job.data.images,
          );
          await this.ticketsService.update(job.data.ticketId, {
            images: imageUrls,
          });
          this.logger.log('[JOB_SUCCESS] Upload ticket images to AWS success');
          return true;
        } catch (error) {
          this.logger.log('[JOB_FAIL] Upload ticket images to AWS fail :((');
          this.logger.debug(error);
          return false;
        }

      default:
        throw new Error('No job name match');
    }
  }

  @OnWorkerEvent('completed')
  onQueueComplete(job: Job, result: any) {
    this.logger.log(`Job has been finished: ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onQueueFailed(job: Job, err: any) {
    this.logger.log(`Job has been failed: ${job.id}`);
    this.logger.log({ err });
  }

  @OnWorkerEvent('error')
  onQueueError(err: any) {
    this.logger.log(`Job has got error: `);
    this.logger.log({ err });
  }
}
