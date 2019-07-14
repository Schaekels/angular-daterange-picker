import { NgModule } from '@angular/core';
import { AngularDaterangePickerComponent } from './angular-daterange-picker.component';
import { DaysViewComponent } from './days-view/days-view.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AngularDaterangePickerComponent,
    DaysViewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AngularDaterangePickerComponent
  ]
})
export class AngularDaterangePickerModule { }
