import { InjectionToken } from "@angular/core";
import { LogType } from "../loggers/logger";
import { LogLevel } from "../loggers/logger-configuration";

export const TransporterToken = new InjectionToken<Transporter>('Transporter');

export interface Transporter {
    write(payload: CapturedPayload, level?: LogLevel): void;
}

export interface TransportTemplate<T> {
    (payload: CapturedPayload): T;
}

export interface CapturedPayload {
    payload: LogType | any;
    level: LogLevel;
    timestamp: Date;
}
