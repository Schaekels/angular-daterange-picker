import { Component, OnInit, Input, ElementRef, Renderer2, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { DatepickerService } from './angular-daterange-picker.service';
import { IDateSelectedEvent } from './date-selected.event';

@Component({
  selector: 'ang-angular-daterange-picker',
  templateUrl: 'angular-daterange-picker.component.html',
  styleUrls: ['angular-daterange-picker.component.scss', './assets/shared.scss'],
  providers: [
    DatepickerService
  ]
})
export class AngularDaterangePickerComponent implements OnInit, AfterViewInit {
  public isMobile = true;
  public date = new Date();

  @Input() startDate: Date;
  @Input() endDate: Date;
  @Input() locale = 'default';

  @Output() rangeSelected = new EventEmitter<IDateSelectedEvent>();

  constructor(private el: ElementRef, private ren: Renderer2, public picker: DatepickerService) { }

  public reset() {
    this.picker.setValue.next({
      startDate: undefined,
      endDate: undefined
    });
  }

  public firstDaySelected(range: IDateSelectedEvent): void {
    this.rangeSelected.emit(range);
  }

  private initDates(): void {

    if (this.startDate !== undefined && this.startDate !== null && this.endDate !== undefined && this.endDate !== null) {
      this.picker.setValue.next({
        startDate: this.startDate,
        endDate: this.endDate
      });
    }
  }

  ngOnInit() {
    if (this.isMobile === true) {
      this.ren.addClass(this.el.nativeElement, 'mobile');
    }
    if (this.startDate !== undefined && this.startDate !== null) {
      this.date = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate());
    }
  }

  ngAfterViewInit() {
    this.initDates();
  }

}
