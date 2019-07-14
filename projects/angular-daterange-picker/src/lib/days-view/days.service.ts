import { Injectable, Renderer2, QueryList, ElementRef, RendererFactory2, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { Subscription, fromEvent, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { IDateSelectedEvent } from '../date-selected.event';
import { DatepickerService } from '../angular-daterange-picker.service';

@Injectable()
export class DaysService implements OnDestroy {
  private ren: Renderer2;
  private subs: Array<Subscription> = new Array<Subscription>();
  private pEndDay: Date;
  private pStartDay: Date;
  private elements: QueryList<ElementRef>;
  private listSub: Subscription;

  private prevActiveElement: ElementRef;
  private prevHoverElement: ElementRef;

  public date: Date;
  public onDateSelected = new Subject<IDateSelectedEvent>();

  set endDay(val: Date) {
    if (val === undefined) {
      this.pEndDay = undefined;
    } else if (this.pEndDay !== undefined && val > this.pEndDay) {
      this.indicationAfterEndDay(val);
      this.pEndDay = val;
    } else {
      this.pEndDay = val;
      this.removeAfterEndDay();
    }
  }

  get endDay(): Date {
    return this.pEndDay;
  }

  set startDay(val: Date) {
    this.pEndDay = undefined;
    this.removeHoverEffect();
    this.pStartDay = val;
  }

  get startDay(): Date {
    return this.pStartDay;
  }

  constructor(private factory: RendererFactory2, public picker: DatepickerService, private cdr: ChangeDetectorRef) {
    this.ren = factory.createRenderer(null, null);
    picker.setValue.subscribe((val) => {
      this.startDay = val.startDate;
      this.endDay = val.endDate;

      if (this.startDay !== undefined && this.startDay !== null  && this.endDay !== null && this.endDay !== undefined) {
        this.renderHover(this.elements);
      }

      this.cdr.detectChanges();
    });
  }

  public initElements(els: QueryList<ElementRef>): void {
    this.elements = els;
    if (this.listSub === undefined) {
      this.subToQueryElements();
    }
    els.forEach((el, index) => {
      this.subs.push(fromEvent(el.nativeElement, 'mouseenter').pipe(
        throttleTime(20)
      ).subscribe(this.onMouseOver(el, index)));
    });
  }

  private subToQueryElements(): void {
    this.listSub = this.elements.changes.subscribe((val) => {
      this.removeElements();
      this.initElements(val);
      this.renderHover(val);
    });
  }

  private renderHover(val: QueryList<ElementRef>): void {
    if (this.pStartDay === undefined) {
      return;
    }

    if (this.pEndDay === undefined) {
      this.forceRemoveHover();
      return;
    }

    if (this.isSameMonth(this.date, this.pStartDay)) {
      if (this.isSameMonth(this.date, this.pEndDay)) {
        this.addHoverEffect(val, this.pEndDay.getDate());
      } else if (this.pStartDay < this.pEndDay) {
        this.sameMonthEndDayBiggerRender();
      }
    } else if (this.isSameMonth(this.date, this.pEndDay)) {
      this.addHoverEffect(val, this.pEndDay.getDate());
    }  else if (this.date > this.pStartDay && this.date < this.pEndDay) {
      this.addHoverEffect(val, val.length);
    } else {
      this.forceRemoveHover();
    }
  }

  private sameMonthEndDayBiggerRender(): void {
    this.removeOutdatedClasses();
    const arr = this.elements.toArray();
    for (let i = 0; i < this.pStartDay.getDate(); i++) {
      this.ren.removeClass(arr[i].nativeElement, 'indication');
    }
    this.addHoverEffect(this.elements, this.elements.length);
  }

  private isSameMonth(date: Date, compare: Date): boolean {
    return date.getFullYear() === compare.getFullYear() && date.getMonth() === compare.getMonth();
  }

  public removeElements(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });

    this.subs = [];
  }

  public removeOutdatedClasses(): void {
    if (this.prevHoverElement !== undefined) {
      this.ren.removeClass(this.prevHoverElement.nativeElement, 'has-active-item-hover');
    }

    if (this.prevActiveElement !== undefined) {
      this.ren.removeClass(this.prevActiveElement.nativeElement, 'no-border-radius-right');
    }
  }

  public removeHoverEffect(): void {
    if (this.isAllowed() === false) {
      return;
    }

    this.forceRemoveHover();
  }

  private forceRemoveHover(): void {
    this.removeOutdatedClasses();
    const arr = this.elements.toArray();
    let limiter = this.pStartDay.getDate();
    if (this.isFutureMonth()) {
      limiter = 0;
    }

    for (let i = limiter; i < arr.length; i++) {
      this.ren.removeClass(arr[i].nativeElement, 'indication');
    }
  }

  private isSameStartDay(day: number, date: Date): boolean {
    if (this.pStartDay === undefined) {
      return false;
    }
    return this.startDay.getFullYear() === date.getFullYear() && this.startDay.getMonth() === date.getMonth()
    && this.startDay.getDate() === day;
  }

  private isSameEndDay(day: number, date: Date): boolean {
    if (this.pEndDay === undefined) {
      return false;
    }
    return this.endDay.getFullYear() === date.getFullYear() && this.endDay.getMonth() === date.getMonth()
    && this.endDay.getDate() === day;
  }

  public isDayActive(day: number, date: Date): boolean {
    return this.isSameStartDay(day, date) || this.isSameEndDay(day, date);

  }

  public isEndActive(day: number, date: Date): boolean {
    return this.isSameEndDay(day, this.date) && !(this.endDay !== this.startDay);
  }

  private isPast(day: number): boolean {
    if (this.isPastMonth() === true) {
      return true;
    } else if (this.startDay.getFullYear() === this.date.getFullYear() &&
    this.startDay.getMonth() === this.date.getMonth()) {
      return day < this.startDay.getDate();
    }
  }

  public setDates(day: number, date: Date) {
    if (this.startDay === undefined || this.isPast(day)) {
      this.startDay = new Date(date.getFullYear(), date.getMonth(), day);
      this.endDay = undefined;
    } else if (this.endDay === undefined) {
      this.endDay = new Date(date.getFullYear(), date.getMonth(), day);
    } else {
      this.startDay = new Date(date.getFullYear(), date.getMonth(), day);
      this.endDay = undefined;
    }
    this.sendEvent();
  }

  private sendEvent(): void {
    this.onDateSelected.next({
      startDate: this.startDay,
      endDate: this.endDay
    });
  }

  private isAllowed(): boolean {
    return !(this.pEndDay !== undefined || this.pStartDay === undefined);
  }

  private removeAfterEndDay(): void {
    const els = this.elements.toArray();
    for (let i = this.pEndDay.getDate(); i < els.length; i++) {
      this.ren.removeClass(els[i].nativeElement, 'indication');
    }
  }

  private indicationAfterEndDay(val: Date): void {
    const arr = this.elements.toArray();
    for (let i = this.pEndDay.getDate(); i < val.getDate(); i++) {
      this.ren.addClass(arr[i].nativeElement, 'indication');
    }
  }

  private addStateClasses(arr: Array<ElementRef>, index: number): void {
    if (this.isSameMonth(this.pStartDay, this.date) === true ) {
      this.ren.addClass(arr[this.pStartDay.getDate() - 1].nativeElement, 'no-border-radius-right');
      this.prevActiveElement = arr[this.pStartDay.getDate() - 1];
    }

    if (arr[index] !== undefined) {
      this.ren.addClass(arr[index].nativeElement, 'has-active-item-hover');
      this.prevHoverElement = arr[index];
    }
  }

  private onMouseOver(el: ElementRef, index: number): (e: Event) => void {
    return (e: Event) => {

      if (this.isAllowed() === false) {
        return;
      }
      if (this.pStartDay.getDate() < index + 1 || this.isFutureMonth()) {
        this.addHoverEffect(this.elements, index);
      } else if (this.pStartDay !== undefined) {
        this.removeHoverEffect();
      }
    };
  }


  private isFutureMonth(): boolean {
    if (this.date.getFullYear() === this.pStartDay.getFullYear()) {
      return this.date.getMonth() > this.pStartDay.getMonth();
    }
    return this.date.getFullYear() > this.pStartDay.getFullYear();
  }

  private isPastMonth(): boolean {
    if (this.date.getFullYear() === this.pStartDay.getFullYear()) {
      return this.date.getMonth() < this.pStartDay.getMonth();
    }
    return this.date.getFullYear() < this.pStartDay.getFullYear();
  }

  private addHoverEffect(els: QueryList<ElementRef>, index: number): void {
    this.removeOutdatedClasses();
    let limiter = this.pStartDay.getDate();
    const arr = els.toArray();
    if (this.isPastMonth() === true) {
      return;
    } else if (this.isFutureMonth() === true) {
      limiter = 0;
    }


    for (let i = limiter; i < index; i++) {
      this.ren.addClass(arr[i].nativeElement, 'indication');
    }

    for (let i = index; i < arr.length; i++) {
      this.ren.removeClass(arr[i].nativeElement, 'indication');
    }

    this.addStateClasses(arr, index);
  }

  /** @TODO delete subs or it will pile up on destory */
  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });

    if (this.listSub !== undefined) {
      this.listSub.unsubscribe();
    }

    this.onDateSelected.complete();
  }
}

