import { TestBed } from '@angular/core/testing';

import { SalarySlipService } from './salary-slip.service';

describe('SalarySlipService', () => {
  let service: SalarySlipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalarySlipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
