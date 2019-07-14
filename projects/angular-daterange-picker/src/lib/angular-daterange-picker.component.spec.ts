import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularDaterangePickerComponent } from './angular-daterange-picker.component';

describe('AngularDaterangePickerComponent', () => {
  let component: AngularDaterangePickerComponent;
  let fixture: ComponentFixture<AngularDaterangePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularDaterangePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularDaterangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
