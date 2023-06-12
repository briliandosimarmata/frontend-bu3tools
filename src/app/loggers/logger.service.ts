import { Inject, Injectable, isDevMode, Optional } from '@angular/core';
import { ConsoleTransporter } from '../transporters/console-transporter';
import { CapturedPayload, Transporter, TransporterToken } from '../transporters/transporter';
import { Logger, LogType } from './logger';
import { LoggerConfiguration, LoggerConfigurationToken, LogLevel } from './logger-configuration';

@Injectable({
  providedIn: 'root'
})
export class LoggerService implements Logger {

  private transporters?: Array<Transporter>;

  constructor(
    @Inject(LoggerConfigurationToken) private loggerConfig: LoggerConfiguration,
    @Optional() @Inject(TransporterToken) transporters?: Array<Transporter>) {

    if (isDevMode()) {
      this.transporters = [new ConsoleTransporter()];
    } else {
      if (transporters) {
        if (transporters.length) {
          this.transporters = Array.isArray(transporters) ? transporters : [transporters];
        }
      } else {
        this.transporters = [new ConsoleTransporter()];
      }
    }
  }

  info(message: string): void {
    this.logWith(LogLevel.Info, message);
  }
  debug(message: string | any): void {
    this.logWith(LogLevel.Debug, message);
  }
  warn(message: string): void {
    this.logWith(LogLevel.Warn, message);
  }
  error(error: LogType): void {
    this.logWith(LogLevel.Error, error);
  }

  private logWith(logLevel: LogLevel, payload: LogType | any) {
    if (this.isEventLevelLessThanLogLevel(logLevel, payload)) {
      const capturedPayload: CapturedPayload =
        { payload, level: logLevel, timestamp: new Date() };

      if (this.transporters) {
        for (const transporter of this.transporters) {
          this.execute(transporter, capturedPayload, logLevel);
        }
      }
    }
  }

  private isEventLevelLessThanLogLevel(logLevel: LogLevel, payload: LogType | any) {
    return payload !== null && this.loggerConfig.level >= logLevel;
  }

  private execute(transport: Transporter, capturedPayload: CapturedPayload, level: LogLevel) {
    // send to event queue to minimize the stack processing for the application
    queueMicrotask(() => transport.write(capturedPayload, level));
  }
}
