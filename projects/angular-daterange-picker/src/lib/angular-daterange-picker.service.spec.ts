import { TestBed } from '@angular/core/testing';

import { AngularDaterangePickerService } from './angular-daterange-picker.service';

describe('AngularDaterangePickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularDaterangePickerService = TestBed.get(AngularDaterangePickerService);
    expect(service).toBeTruthy();
  });
});
