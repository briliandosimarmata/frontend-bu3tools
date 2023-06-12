import { InjectionToken } from "@angular/core";

export const LoggerConfigurationToken =
    new InjectionToken<LoggerConfiguration>('LoggerConfiguration');

export interface LoggerConfiguration {
    level: LogLevel;
}

export enum LogLevel {
    All = 5,
    Info = 4,
    Debug = 3,
    Warn = 2,
    Error = 1,
}