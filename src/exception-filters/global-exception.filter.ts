import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException ? exception.getStatus() : 500;
    const message = isHttpException ? exception.message : 'Internal server error';

    console.log(exception);

    response.status(statusCode).json({
      statusCode,
      message,
      error:
        this.configService.get('NODE_ENV') !== 'production'
          ? {
              response: exception.response,
              stack: exception.stack,
            }
          : undefined,
    });
  }
}
