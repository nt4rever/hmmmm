/* eslint-disable @typescript-eslint/no-unused-vars */
import { MailService } from '@/modules/mail/mail.service';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { TicketsService } from '../tickets.service';
import { AwsService } from '@/modules/aws/aws.service';
import { EvidencesService } from '../evidences.service';
import { VolunteersService } from '@/modules/volunteers/volunteers.service';
import { TasksService } from '@/modules/tasks/tasks.service';
import { TASK_STATUS } from '@/modules/tasks/entities';
import { ConfigService } from '@nestjs/config';
import { AiService } from '../ai.service';
import { AiServiceError } from '@/common/interfaces';

@Processor('image:upload')
export class UploadImageProcessor extends WorkerHost {
  private logger = new Logger(UploadImageProcessor.name);

  constructor(
    private readonly ticketsService: TicketsService,
    private readonly evidencesService: EvidencesService,
    private readonly awsService: AwsService,
    private readonly aiService: AiService,
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
          const data = await this.aiService.predicts(imageUrls);
          await this.ticketsService.update(job.data.ticketId, {
            severity_level: data,
          });
          this.logger.log('[JOB_SUCCESS] Get data from AI service');
          return true;
        } catch (error) {
          if (error instanceof AiServiceError) {
            this.logger.debug(error.message);
            return true;
          }
          console.log(error);
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
  private logger = new Logger(SendMailProcessor.name);

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
          console.log(error);
          throw error;
        }
      case 'ticket-assigned':
        try {
          await this.mailService.ticketAssigned(
            job.data.email,
            job.data.ticketId,
            job.data.taskId,
          );
          this.logger.log('[JOB_SUCCESS] Send email assign ticket successfully to user');
          return true;
        } catch (error) {
          console.log(error);
          throw error;
        }

      default:
        throw new Error('No job name match');
    }
  }
}

@Processor('assign-task')
export class AssignTaskProcessor extends WorkerHost {
  private logger = new Logger(AssignTaskProcessor.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly volunteerService: VolunteersService,
    private readonly ticketsService: TicketsService,
    private readonly tasksService: TasksService,
    @InjectQueue('mail')
    private readonly mailQueue: Queue,
  ) {
    super();
  }
  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    switch (job.name) {
      case 'assign-task':
        try {
          const ticket = await this.ticketsService.findOne(job.data.ticketId, {
            join: {
              path: 'area',
            },
          });
          const volunteers = await this.volunteerService.getVolunteerWithDistance(
            ticket.area,
            job.data.location,
          );

          // If system can not find any volunteers, skip this task
          if (volunteers.length === 0) {
            this.logger.warn('[ASSIGN_TASK_FAIL] Can not find any volunteers');
            return true;
          }

          let assigneeEmail: string = null;
          let assignTaskId: string = null;

          for (const volunteer of volunteers) {
            const tasks = await this.tasksService.count({
              assignee: volunteer,
              status: TASK_STATUS.PENDING,
            });

            // Check whether a volunteer is free or has too many tasks (env MAX_TASK = 5)
            //  If a volunteer has too many tasks (status = PENDING) then iterate on to the next volunteer
            if (tasks <= this.configService.get<number>('ticket.max_task')) {
              // Create a new task and assign to this volunteer (deadline 6h hours)
              const taskAssign = await this.tasksService.create({
                ticket,
                assignee: volunteer,
                expires_at:
                  Date.now() +
                  3600 * 1000 * this.configService.get<number>('ticket.task_expires_at'),
              });
              assigneeEmail = volunteer.email;
              assignTaskId = taskAssign._id.toString();
              break;
            }
          }

          // If all volunteers are busy, assign a task to the first volunteer
          if (!assigneeEmail) {
            const taskAssign = await this.tasksService.create({
              ticket,
              assignee: volunteers[0],
              expires_at: Date.now() + 3600 * 1000 * 6,
            });
            assigneeEmail = volunteers[0].email;
            assignTaskId = taskAssign._id.toString();
          }

          this.mailQueue.add(
            'ticket-assigned',
            {
              ticketId: ticket.id,
              email: assigneeEmail,
              taskId: assignTaskId,
            },
            { removeOnComplete: true },
          );

          this.logger.log('[ASSIGN_TASK_SUCCESS] Task is assigned');

          return true;
        } catch (error) {
          console.log(error);
          throw error;
        }

      default:
        throw new Error('No job name match');
    }
  }
}
