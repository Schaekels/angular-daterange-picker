import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { IDateSelectedEvent } from './date-selected.event';


@Injectable()
export class DatepickerService implements OnDestroy {
  public onNext = new Subject<void>();
  public onPrevious = new Subject<void>();

  public setValue = new Subject<IDateSelectedEvent>();

  public headerLeft: string;
  public headerRight: string;

  constructor() {}

  ngOnDestroy() {
    this.onNext.complete();
    this.onPrevious.complete();
    this.setValue.complete();
  }
}
