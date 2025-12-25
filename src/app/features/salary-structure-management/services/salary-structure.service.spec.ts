import { TestBed } from '@angular/core/testing';

import { SalaryStructureService } from './salary-structure.service';

describe('SalaryStructureService', () => {
  let service: SalaryStructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryStructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
