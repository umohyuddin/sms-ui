import { TestBed } from '@angular/core/testing';

import { EmployeeBonusService } from './employee-bonus.service';

describe('EmployeeBonusService', () => {
  let service: EmployeeBonusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeBonusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
