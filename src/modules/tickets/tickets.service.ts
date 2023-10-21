import { BaseServiceAbstract } from '@/services/base';
import { Inject, Injectable } from '@nestjs/common';
import { Ticket } from './entities';
import { TicketsRepository } from '@/repositories/ticket.repository';
import { AwsService } from '../aws/aws.service';
import { randomUUID } from 'crypto';
import { OnEvent } from '@nestjs/event-emitter';
import { SendEmailTicketCreatedEvent, UploadTicketImageEvent } from './events';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class TicketsService extends BaseServiceAbstract<Ticket> {
  constructor(
    @Inject('TicketsRepositoryInterface')
    private readonly ticketsRepository: TicketsRepository,
    private readonly awsService: AwsService,
    @InjectQueue('image:upload')
    private readonly imageUploadQueue: Queue,
    @InjectQueue('mail')
    private readonly mailQueue: Queue,
  ) {
    super(ticketsRepository);
  }

  @OnEvent('ticket.upload-image')
  handleUploadTicketImages(payload: UploadTicketImageEvent) {
    this.imageUploadQueue.add('upload-image', payload, {
      removeOnComplete: true,
    });
  }

  @OnEvent('ticket.send-mail')
  handleSendMail(payload: SendEmailTicketCreatedEvent) {
    this.mailQueue.add('ticket-created', payload, { removeOnComplete: true });
  }

  async uploadImages(ticketId: string, files: Express.Multer.File[]) {
    try {
      const listUpload = files.map((file) => {
        const key = `tickets/${ticketId}/${randomUUID()}.${file.originalname
          .split('.')
          .at(-1)}`;
        return this.awsService.uploadPublicFile(Buffer.from(file.buffer), key);
      });

      return await Promise.all(listUpload);
    } catch (error) {
      throw error;
    }
  }
}
