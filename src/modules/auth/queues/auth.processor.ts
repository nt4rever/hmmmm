/* eslint-disable @typescript-eslint/no-unused-vars */
import { MailService } from '@/modules/mail/mail.service';
import { User } from '@/modules/users/entities';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('mail-auth')
export class SendMailProcessor extends WorkerHost {
  private logger = new Logger(SendMailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    switch (job.name) {
      case 'forgot-password':
        try {
          const user: User = job.data.user;
          await this.mailService.resetPassword({
            email: user.email,
            name: user.last_name,
            userId: user._id.toString(),
            token: job.data.token,
          });
          this.logger.log(
            '[JOB_SUCCESS] Send email forgot password successfully to user',
          );
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
