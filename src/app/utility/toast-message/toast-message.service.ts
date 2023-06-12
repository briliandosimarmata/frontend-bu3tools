import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 } from 'uuid';
import { hiddenClass, Message, shownClass, ToastMessage } from './toast-message';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {

  private messsageInfo: BehaviorSubject<ToastMessage> = new BehaviorSubject<ToastMessage>({
    id: '',
    message: {
      code: '',
      description: ''
    },
    type: 'none',
    transitionClass: 'opacity-0 mt-4',
    isShown: false
  });

  constructor() { }

  getUsedMessageInfo(): Observable<ToastMessage> {
    return this.messsageInfo.asObservable();
  }

  error(e: any, isCustom?: boolean, customMessage?: Message, delay?: number) {

    let message: Message = {
      code: 'Terjadi kesalahan!',
      description: 'Kesalahan tidak terduga, mohon hubungi developer.'
    };

    if (isCustom) {
      if (customMessage !== null && customMessage !== undefined) {
        message = customMessage;
      }
    } else {
      if (e.error.message !== undefined && e.error.message !== null) {
        let code = e.error.message.code;
        let description = e.error.message.description;
  
        if (code !== undefined && code !== null) {
          message.code = code;
        }
  
        if (description !== undefined && description !== null) {
          message.description = description;
        }
      }
    }

    let toastMessage: ToastMessage = {
      id: v4(),
      message: message,
      type: 'error',
      transitionClass: hiddenClass,
      isShown: true
    }

    this.messsageInfo.next(toastMessage);
  }

  success(message?: Message, delay?: number) {

    if (message !== undefined && message !== null) {

      if (message.code === undefined && message.code === null) {
        message.code = 'Sukses!';
      }

      if (message.description === undefined && message.description === null) {
        message.description = 'Action berhasil dilakukan.';
      }

    } else {
      message = {
        code: 'Sukses.',
        description: 'Action berhasil dilakukan!'
      }
    }

    let toastMessage: ToastMessage = {
      id: v4(),
      message: message,
      type: 'success',
      transitionClass: hiddenClass,
      isShown: true
    }

    this.messsageInfo.next(toastMessage);
  }
}
