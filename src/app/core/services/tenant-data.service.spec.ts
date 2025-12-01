import { TestBed } from '@angular/core/testing';

import { TenantDataService } from './tenant-data.service';

describe('TenantDataService', () => {
  let service: TenantDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
