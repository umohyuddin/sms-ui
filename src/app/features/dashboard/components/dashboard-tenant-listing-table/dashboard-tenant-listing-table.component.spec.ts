import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DashboardTenantListingTableComponent } from './dashboard-tenant-listing-table.component';
import { AppConfigService } from '../../../../core/services/app-config.service';

describe('DashboardTenantListingTableComponent', () => {
  let component: DashboardTenantListingTableComponent;
  let fixture: ComponentFixture<DashboardTenantListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTenantListingTableComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AppConfigService, useValue: { apiBaseUrl: '' } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTenantListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
