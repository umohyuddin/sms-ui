import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { TenantManagementService } from './tenant-management.service';

describe('TenantManagementService', () => {
  let service: TenantManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule
      ]
    });
    service = TestBed.inject(TenantManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
