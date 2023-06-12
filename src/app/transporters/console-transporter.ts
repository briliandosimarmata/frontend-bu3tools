import { LogType } from "../loggers/logger";
import { LogLevel } from "../loggers/logger-configuration";
import { AbstractTransporter } from "./abstract-transporter";
import { CapturedPayload, TransportTemplate } from "./transporter";

const defaultConsoleTransporterTemplate = <T>(p: CapturedPayload) => p.payload as T;

export class ConsoleTransporter extends AbstractTransporter<any>{

    constructor(template?: TransportTemplate<LogType | any>) {
        super(template || defaultConsoleTransporterTemplate);
    }

    doWrite(payload: any, level?: LogLevel | undefined): void {
        switch (level) {
            case LogLevel.Info:
                return console.info(payload);
            case LogLevel.Debug:
                return console.debug(payload);
            case LogLevel.Warn:
                return console.warn(payload);
            case LogLevel.Error:
                return console.error(payload);
        }
    }
}
