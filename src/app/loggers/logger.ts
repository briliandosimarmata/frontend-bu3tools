import { HttpErrorResponse } from "@angular/common/http";
import { InjectionToken } from "@angular/core";

export const LoggerToken = new InjectionToken<Logger>('Logger');

export type LogType = string | Error | HttpErrorResponse;

export interface Logger {
    info(message: string): void;
    debug(message: string): void;
    warn(message: string): void;
    error(error: LogType): void;
}