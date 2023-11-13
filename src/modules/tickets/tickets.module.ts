import { TicketsRepository } from '@/repositories/ticket.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Evidence, EvidenceSchema, Ticket, TicketSchema } from './entities';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { AwsModule } from '../aws/aws.module';
import { AreasModule } from '../areas/areas.module';
import { BullModule } from '@nestjs/bullmq';
import {
  AssignTaskProcessor,
  SendMailProcessor,
  UploadImageProcessor,
} from './queues/ticket.processor';
import { EvidencesRepository } from '@/repositories/evidence.repository';
import { VolunteersModule } from '../volunteers/volunteers.module';
import { TasksModule } from '../tasks/tasks.module';
import { EvidencesService } from './evidences.service';
import { UsersModule } from '../users/users.module';

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
      {
        name: 'assign-task',
        prefix: 'ticket',
      },
    ),
    AwsModule,
    AreasModule,
    VolunteersModule,
    TasksModule,
    UsersModule,
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
    AssignTaskProcessor,
  ],
  exports: [TicketsService, EvidencesService],
})
export class TicketsModule {}
