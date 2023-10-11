import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import mongoose from 'mongoose';

@Catch(mongoose.mongo.MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  catch(exception: mongoose.mongo.MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = HttpStatus.BAD_REQUEST;
    let message = 'Internal server error';

    switch (exception.code) {
      case 11000:
        message = ERRORS_DICTIONARY.DB_RECORD_DUPLICATE;
        break;
      case 31254:
        message = ERRORS_DICTIONARY.DB_QUERY_FAIL;
    }

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode,
      message,
      error:
        this.configService.get('NODE_ENV') !== 'production'
          ? {
              stack: exception.stack,
            }
          : undefined,
    });
  }
}
