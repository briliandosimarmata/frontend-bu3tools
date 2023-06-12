import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private sessionId$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() { }

  getSessionIdObservable() {
    return this.sessionId$.asObservable();
  }

  setSessionId(sessionId: string) {
    this.sessionId$.next(sessionId);
  }
}
