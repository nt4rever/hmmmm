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

  async resetPassword(payload: {
    email: string;
    name: string;
    token: string;
    userId: string;
  }) {
    try {
      const url = `${process.env.APP_URL}/reset-password?userId=${payload.userId}&token=${payload.token}`;
      await this.mailerService.sendMail({
        to: payload.email,
        subject: '[RTS] Reset your password',
        template: './reset-password.hbs',
        context: {
          name: payload.name,
          url,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async ticketCreated(email: string, ticketId: string) {
    try {
      const url = `${process.env.APP_URL}/forum/${ticketId}`;
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
