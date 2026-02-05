import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const error = exception.getError();
    const normalized =
      typeof error === 'string'
        ? { message: error, statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
        : (error as { message?: string | string[]; statusCode?: number });

    const status = normalized.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message = normalized.message ?? 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
