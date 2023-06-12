import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { Logger, LoggerToken } from '../loggers/logger';


@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(@Inject(LoggerToken) private logger: Logger, private http: HttpClient) { }

  handleError(error: Error): void {
    if (error instanceof Error) {
      this.logger.error(error);
    }
  }

}
