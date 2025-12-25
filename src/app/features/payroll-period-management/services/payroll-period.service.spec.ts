import { TestBed } from '@angular/core/testing';

import { PayrollPeriodService } from './payroll-period.service';

describe('PayrollPeriodService', () => {
  let service: PayrollPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollPeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
