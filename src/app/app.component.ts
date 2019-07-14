import { Component, ViewChild } from '@angular/core';
import { IDateSelectedEvent, AngularDaterangePickerComponent } from 'projects/angular-daterange-picker/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'daterangepicker';
  public range: IDateSelectedEvent;
  public isShow = true;

  @ViewChild('picker', { read: AngularDaterangePickerComponent }) picker: AngularDaterangePickerComponent;

  public rangeSelected(range: IDateSelectedEvent): void {
    this.range = range;
  }

  public reset() {
    this.picker.reset();
  }
}
