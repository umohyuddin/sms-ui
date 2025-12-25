import { TestBed } from '@angular/core/testing';

import { SalaryPaymentService } from './salary-payment.service';

describe('SalaryPaymentService', () => {
  let service: SalaryPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
