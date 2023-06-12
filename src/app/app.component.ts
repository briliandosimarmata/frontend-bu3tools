import { Component, isDevMode } from '@angular/core';
import { v4 } from 'uuid';
import { AppService } from './app.service';
import { AppSettings } from './app-setting';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend-bu3tools';

  constructor(private service: AppService) {
    this.service.setSessionId(v4());

    if(!isDevMode()) {
      AppSettings.apiDefaultPrefix = '../bu3-tools-api'
    }
  }
}
