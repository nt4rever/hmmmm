/* eslint-disable @typescript-eslint/no-unused-vars */
import { MailService } from '@/modules/mail/mail.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { TicketsService } from '../tickets.service';
import { AwsService } from '@/modules/aws/aws.service';
import { EvidencesService } from '../evidences.service';

@Processor('image:upload')
export class UploadImageProcessor extends WorkerHost {
  private logger = new Logger(UploadImageProcessor.name);

  constructor(
    private readonly ticketsService: TicketsService,
    private readonly evidencesService: EvidencesService,
    private readonly awsService: AwsService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    switch (job.name) {
      case 'upload-image':
        try {
          const imageUrls = await this.awsService.uploadMultipleFile(
            `tickets/${job.data.ticketId}`,
            job.data.images,
          );
          await this.ticketsService.update(job.data.ticketId, {
            images: imageUrls,
          });
          this.logger.log('[JOB_SUCCESS] Upload ticket images to AWS success');
          return true;
        } catch (error) {
          throw error;
        }

      case 'upload-image-evidence':
        const imageUrls = await this.awsService.uploadMultipleFile(
          `evidences/${job.data.ticketId}/${job.data.evidenceId}`,
          job.data.images,
        );
        await this.evidencesService.update(job.data.evidenceId, {
          images: imageUrls,
        });
        this.logger.log('[JOB_SUCCESS] Upload evidence images to AWS success');

      default:
        throw new Error('No job name match');
    }
  }
}

@Processor('mail')
export class SendMailProcessor extends WorkerHost {
  private logger = new Logger(UploadImageProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    switch (job.name) {
      case 'ticket-created':
        try {
          await this.mailService.ticketCreated(job.data.email, job.data.ticketId);
          this.logger.log('[JOB_SUCCESS] Send email create ticket successfully to user');
          return true;
        } catch (error) {
          throw error;
        }

      default:
        throw new Error('No job name match');
    }
  }
}
