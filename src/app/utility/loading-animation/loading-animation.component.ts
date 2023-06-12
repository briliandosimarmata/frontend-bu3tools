import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { LoadingAnimationService } from './loading-animation.service';

@Component({
  selector: 'app-loading-animation',
  templateUrl: './loading-animation.component.html'
})

export class LoadingAnimationComponent implements OnInit {

  protected hidingClass: string;

  constructor(private service: LoadingAnimationService, private cDRef: ChangeDetectorRef) { 
    this.hidingClass = 'hidden';
  }

  ngOnInit(): void {
    this.service.getUsedHidingClass().subscribe(
      (cls) => {
        this.hidingClass = cls;
        this.cDRef.detectChanges();
      }
    )
  }

}
