import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnprocessableEntityException)
export class ClassValidatorExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: ERRORS_DICTIONARY.VALIDATION_ERROR,
      error: exception.response?.message,
    });
  }
}
