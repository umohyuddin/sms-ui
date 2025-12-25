import { TestBed } from '@angular/core/testing';

import { SalaryComponentService } from './salary-component.service';

describe('SalaryComponentService', () => {
  let service: SalaryComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
