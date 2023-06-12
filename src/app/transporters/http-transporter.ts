import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppSettings } from "../app-setting";
import { LogLevel } from "../loggers/logger-configuration";
import { AbstractTransporter } from "./abstract-transporter";
import { CapturedPayload } from "./transporter";

const defaultHttpTransporterTemplate = <T>(p: CapturedPayload) => p.payload as T;

@Injectable({
    providedIn: 'root'
})
export class HttpTransporter extends AbstractTransporter<any>{

    constructor(private http: HttpClient) {
        super(defaultHttpTransporterTemplate);
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
                this.resolveError(payload);
        }
    }

    private resolveError(error: Error) {
        if (error instanceof Error) {
            if (error.stack !== undefined) {

                let isReqComplete: boolean = false;
                let $sMResolver = this.http.post<any>(AppSettings.sourceMapResolverUrlApi, { stack: error.stack }, {
                    headers: {
                        "Auth-Token": 'eyJhbGciOiJFUzI1NiJ9.ZDE1dFJ2Mw.lXQXJSX2nyYp9Rn7p8-kG561aI7m3rAL52wI6t-zxUYxK3J0vx2-Wy8GBsMCoO1nuAyl1TIy2EhF7bbGMnifIA'
                    }
                });

                let sMResolverSubs = $sMResolver.subscribe(
                    {
                        next: (res) => {
                            if (res.data.stack) {
                                console.error(res.data.stack);
                            }
                            isReqComplete = true
                        },
                        error: (err) => {
                            console.error(err);
                        }
                    }
                )

                let unsubsInterval = setInterval(() => {
                    if (isReqComplete) {
                        console.log('Unsubscribing api source-map-resolver...');
                        sMResolverSubs.unsubscribe();
                    }
                    clearInterval(unsubsInterval)
                }, 3000);
            }
        }
    }

}
