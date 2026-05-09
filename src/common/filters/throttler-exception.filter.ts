// src/filters/throttler-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(HttpStatus.TOO_MANY_REQUESTS).json({
      success:    false,
      statusCode: 429,
      message:    'Too many attempts. Try again after 15 minutes.',
      retryAfter: 900, // 15 min in seconds
    });
  }
}