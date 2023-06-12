import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingAnimationService {

  private hidingClass$: BehaviorSubject<string> = new BehaviorSubject<string>('hidden');

  constructor() { }

  getUsedHidingClass(): Observable<string> {
    return this.hidingClass$.asObservable();
  }

  showAnimation() {
    this.hidingClass$.next('block');
  }

  hideAnimation() {
    this.hidingClass$.next('hidden');
  }
}
