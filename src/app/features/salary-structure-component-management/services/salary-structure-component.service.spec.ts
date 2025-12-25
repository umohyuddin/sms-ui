import { TestBed } from '@angular/core/testing';

import { SalaryStructureComponentService } from './salary-structure-component.service';

describe('SalaryStructureComponentService', () => {
  let service: SalaryStructureComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryStructureComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
