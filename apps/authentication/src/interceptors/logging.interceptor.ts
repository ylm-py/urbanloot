import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: any): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, params, query } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        const logMessage = {
          timestamp: new Date().toISOString(),
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          request: {
            body,
            params,
            query,
          },
          response: data,
        };

        if (statusCode >= 400) {
          this.logger.error(JSON.stringify(logMessage, null, 2));
        } else {
          this.logger.log(JSON.stringify(logMessage, null, 2));
        }
      }),
    );
  }
}
