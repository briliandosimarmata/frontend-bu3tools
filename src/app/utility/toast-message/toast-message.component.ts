import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { hiddenClass, shownClass, ToastMessage } from './toast-message';
import { ToastMessageService } from './toast-message.service';

@Component({
  selector: 'app-toast-message',
  templateUrl: './toast-message.component.html'
})
export class ToastMessageComponent implements OnInit {

  protected toastMessages: ToastMessage[];

  constructor(private service: ToastMessageService, private cDRef: ChangeDetectorRef) {
    this.toastMessages = [];
  }

  ngOnInit(): void {
    this.service.getUsedMessageInfo().subscribe(
      (msg) => {

        if (msg.type !== 'none') {

          this.toastMessages.forEach(
            (tm) => {
              this.hideElement(document.getElementById(tm.id));
              clearInterval(tm.intervalFunc);
            }
          )

          this.toastMessages.push(msg);

          setTimeout(() => {
            msg.transitionClass = shownClass;
            msg.intervalFunc = setInterval(() => {

              document.getElementById(msg.id)?.addEventListener(
                'transitionend', () => {
                  this.toastMessages =
                    [this.toastMessages[this.toastMessages.length - 1]];
                }, {
                once: true
              });

              clearInterval(msg.intervalFunc);
              this.hideElement(document.getElementById(msg.id));

            }, 5000);
          }, 20);

        }

        this.cDRef.detectChanges();
      }
    )
  }

  protected hideAndClearToastMessage(toastMessageElement: HTMLElement) {

    toastMessageElement.addEventListener(
      'transitionend', () => {
        this.toastMessages = [];
      });

    this.hideElement(toastMessageElement);
  }

  private hideElement(toastMessageElement: HTMLElement | null) {
    if (toastMessageElement === null) {
      return;
    }

    toastMessageElement.addEventListener(
      'transitionend', () => {

        let toastMessage = this.toastMessages.find((val) => {
          return val.id === toastMessageElement.id;
        });

        if (toastMessage !== undefined) {
          toastMessage.isShown = false;
        }
      }, {
      once: true
    });

    shownClass.trim().split(/\s+/).forEach(
      (cls) => {
        toastMessageElement.classList.remove(cls);
      }
    );

    hiddenClass.trim().split(/\s+/).forEach(
      (cls) => {
        toastMessageElement.classList.add(cls);
      }
    );

  }

  protected clearCountDownHidingToastMessage(toastMessage: ToastMessage) {
    clearInterval(toastMessage.intervalFunc);
  }

  protected countDownHidingToastMessage(toastMessageElement: HTMLDivElement, toastMessage: ToastMessage) {
    toastMessage.intervalFunc = setInterval(() => {

      toastMessageElement.addEventListener(
        'transitionend', () => {
          this.toastMessages = [];
        });

      this.hideElement(toastMessageElement);
      clearInterval(toastMessage.intervalFunc);
      this.cDRef.detectChanges();
    }, 5000);
  }

}
