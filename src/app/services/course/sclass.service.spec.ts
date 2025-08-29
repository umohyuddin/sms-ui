import { TestBed } from '@angular/core/testing';

import { SclassService } from './sclass.service';

describe('SclassService', () => {
  let service: SclassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SclassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
