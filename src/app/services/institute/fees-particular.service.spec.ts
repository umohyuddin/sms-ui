import { TestBed } from '@angular/core/testing';

import { FeesParticularService } from './fees-particular.service';

describe('FeesParticularService', () => {
  let service: FeesParticularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeesParticularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
