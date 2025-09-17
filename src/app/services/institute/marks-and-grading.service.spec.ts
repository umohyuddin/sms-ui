import { TestBed } from '@angular/core/testing';

import { MarksAndGradingService } from './marks-and-grading.service';

describe('MarksAndGradingService', () => {
  let service: MarksAndGradingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarksAndGradingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
