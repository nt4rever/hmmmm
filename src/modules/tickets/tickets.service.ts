import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { BaseServiceAbstract } from '@/services/base';
import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { Area } from '../areas/entities';
import { Ticket } from './entities';
import {
  AddEvidenceEvent,
  SendEmailTicketCreatedEvent,
  UploadEvidenceImageEvent,
  UploadTicketImageEvent,
} from './events';
import { TicketsRepositoryInterface } from './interfaces';

@Injectable()
export class TicketsService extends BaseServiceAbstract<Ticket> {
  private logger: Logger = new Logger(TicketsService.name);

  constructor(
    @Inject('TicketsRepositoryInterface')
    private readonly ticketsRepository: TicketsRepositoryInterface,
    @InjectQueue('image:upload')
    private readonly imageUploadQueue: Queue,
    @InjectQueue('mail')
    private readonly mailQueue: Queue,
  ) {
    super(ticketsRepository);
  }

  async getByArea(id: string, area: Area) {
    try {
      const ticket = await this.findOneByCondition({
        _id: id,
        area,
      });
      if (!ticket) {
        throw new NotFoundException(ERRORS_DICTIONARY.TICKET_NOT_FOUND);
      }
      return ticket;
    } catch (error) {
      throw error;
    }
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

  @OnEvent('evidence.upload-image')
  handleUploadEvidenceImage(payload: UploadEvidenceImageEvent) {
    this.imageUploadQueue.add('upload-image-evidence', payload, {
      removeOnComplete: true,
    });
  }

  @OnEvent('ticket.add-evidence', { async: true })
  async handleAddEvidence({ ticketId, evidenceId, type }: AddEvidenceEvent) {
    try {
      await this.ticketsRepository.addEvidence(ticketId, evidenceId, type);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
