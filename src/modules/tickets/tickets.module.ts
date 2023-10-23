import { TicketsRepository } from '@/repositories/ticket.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Evidence, EvidenceSchema, Ticket, TicketSchema } from './entities';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { AwsModule } from '../aws/aws.module';
import { AreasModule } from '../areas/areas.module';
import { BullModule } from '@nestjs/bullmq';
import { SendMailProcessor, UploadImageProcessor } from './queues/ticket.processor';
import { EvidencesRepository } from '@/repositories/evidence.repository';
import { VolunteersModule } from '../volunteers/volunteers.module';
import { TasksModule } from '../tasks/tasks.module';
import { EvidencesService } from './evidences.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
      {
        name: Evidence.name,
        schema: EvidenceSchema,
      },
    ]),
    BullModule.registerQueue(
      {
        name: 'image:upload',
        prefix: 'ticket',
      },
      {
        name: 'mail',
        prefix: 'ticket',
      },
    ),
    AwsModule,
    AreasModule,
    VolunteersModule,
    TasksModule,
  ],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    EvidencesService,
    {
      provide: 'TicketsRepositoryInterface',
      useClass: TicketsRepository,
    },
    {
      provide: 'EvidencesRepositoryInterface',
      useClass: EvidencesRepository,
    },
    UploadImageProcessor,
    SendMailProcessor,
  ],
  exports: [TicketsService, EvidencesService],
})
export class TicketsModule {}
