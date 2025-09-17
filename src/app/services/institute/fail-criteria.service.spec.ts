import { TestBed } from '@angular/core/testing';

import { FailCriteriaService } from './fail-criteria.service';

describe('FailCriteriaService', () => {
  let service: FailCriteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FailCriteriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
