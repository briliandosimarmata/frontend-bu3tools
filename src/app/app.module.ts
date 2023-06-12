import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy, faFileClipboard, faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faCheck, faChevronDown, faDownload, faGears, faUpload, faXmark } from '@fortawesome/free-solid-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalErrorHandlerService } from './error-handler/global-error-handler.service';
import { LoggerToken } from './loggers/logger';
import { LoggerConfigurationToken, LogLevel } from './loggers/logger-configuration';
import { LoggerService } from './loggers/logger.service';
import { MainModule } from './main/main.module';
import { HttpTransporter } from './transporters/http-transporter';
import { TransporterToken } from './transporters/transporter';
import { LoadingAnimationModule } from './utility/loading-animation/loading-animation.module';
import { ToastMessageModule } from './utility/toast-message/toast-message.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MainModule,
    AppRoutingModule,
    ToastMessageModule,
    LoadingAnimationModule,
    FontAwesomeModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    {
      provide: LoggerToken,
      useClass: LoggerService
    },
    {
      provide: LoggerConfigurationToken,
      useValue: {
        level: LogLevel.All
      }
    },
    {
      provide: TransporterToken,
      useClass: HttpTransporter,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

  constructor(faIconLibrary: FaIconLibrary) {
    faIconLibrary.addIcons(
      faChevronDown, 
      faUpload, 
      faArrowLeft, 
      faGears,
      faCopy,
      faDownload,
      faCheck,
      faXmark,
      faXmarkCircle,
      faFileClipboard)
  }
}
