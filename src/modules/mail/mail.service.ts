import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private logger: Logger;
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {
    this.logger = new Logger(MailService.name);
  }

  async resetPassword(email: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './reset-password.hbs',
        context: {
          name: 'Tan',
          url: 'localhost',
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async ticketCreated(email: string, ticketId: string) {
    try {
      const url = `${process.env.APP_URL}/report/${ticketId}`;
      await this.mailerService.sendMail({
        to: email,
        subject: '[RTS] Your report create successfully',
        template: './ticket-created.hbs',
        context: {
          url,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async ticketAssigned(email: string, ticketId: string, taskId: string) {
    try {
      const url = `${process.env.APP_URL}/tasks/${taskId}`;
      await this.mailerService.sendMail({
        to: email,
        subject: '[RTS] You has been assigned to the ticket',
        template: './ticket-assigned.hbs',
        context: {
          ticketId,
          url,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
