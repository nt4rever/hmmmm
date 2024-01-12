/* eslint-disable @typescript-eslint/no-unused-vars */
import { MailService } from '@/modules/mail/mail.service';
import { ROLES, User } from '@/modules/users/entities';
import { UsersService } from '@/modules/users/users.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('mail-task')
export class SendMailProcessor extends WorkerHost {
  private logger = new Logger(SendMailProcessor.name);

  constructor(
    private readonly mailService: MailService,
    private readonly userService: UsersService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    switch (job.name) {
      case 'cancel-task':
        try {
          const { ticketId, name, area } = job.data;
          const managers = await this.userService.findAll({
            area,
            role: ROLES.AreaManager,
            is_active: true,
          });
          const emails = managers.map((m) => m.email);
          await this.mailService.cancelTask(emails, name, ticketId);
          this.logger.log('[JOB_SUCCESS] Send email cancel task successfully to manager');
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
