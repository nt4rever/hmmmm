import { EvidencesRepository } from '@/repositories/evidence.repository';
import { TicketsRepository } from '@/repositories/ticket.repository';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreasModule } from '../areas/areas.module';
import { AwsModule } from '../aws/aws.module';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';
import { VolunteersModule } from '../volunteers/volunteers.module';
import { Evidence, EvidenceSchema, Ticket, TicketSchema } from './entities';
import { EvidencesService } from './evidences.service';
import {
  AssignTaskProcessor,
  SendMailProcessor,
  UploadImageProcessor,
} from './queues/ticket.processor';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

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
