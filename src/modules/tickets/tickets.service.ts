import { BaseServiceAbstract } from '@/services/base';
import { Inject, Injectable } from '@nestjs/common';
import { Ticket } from './entities';
import { TicketsRepository } from '@/repositories/ticket.repository';
import { AwsService } from '../aws/aws.service';
import { randomUUID } from 'crypto';

@Injectable()
export class TicketsService extends BaseServiceAbstract<Ticket> {
  constructor(
    @Inject('TicketsRepositoryInterface')
    private readonly ticketsRepository: TicketsRepository,
    private readonly awsService: AwsService,
  ) {
    super(ticketsRepository);
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
