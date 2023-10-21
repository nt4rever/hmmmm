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
      await this.mailerService.sendMail({
        to: email,
        subject: '[RTS] Your report create successfully',
        template: './ticket-created.hbs',
        context: {
          ticketId,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
