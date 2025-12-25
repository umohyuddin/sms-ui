import { TestBed } from '@angular/core/testing';

import { EmployeeDeductionService } from './employee-deduction.service';

describe('EmployeeDeductionService', () => {
  let service: EmployeeDeductionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeDeductionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
