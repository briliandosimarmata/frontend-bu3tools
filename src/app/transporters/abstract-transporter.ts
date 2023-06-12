import { LogLevel } from "../loggers/logger-configuration";
import { CapturedPayload, Transporter, TransportTemplate } from "./transporter";

export abstract class AbstractTransporter<T> implements Transporter {

    template: TransportTemplate<T>;
    constructor(template: TransportTemplate<T>) {
        this.template = template;
    }

    write(payload: CapturedPayload, level?: LogLevel): void {
        const templatePayload = this.template(payload);
        this.doWrite(templatePayload, level);
    }

    abstract doWrite(payload: T, level?: LogLevel): void;
}
