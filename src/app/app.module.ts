import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularDaterangePickerModule } from 'projects/angular-daterange-picker/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularDaterangePickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
