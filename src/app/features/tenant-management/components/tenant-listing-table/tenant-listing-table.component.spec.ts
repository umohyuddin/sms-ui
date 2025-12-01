import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { TenantListingTableComponent } from './tenant-listing-table.component';

describe('TenantListingTableComponent', () => {
  let component: TenantListingTableComponent;
  let fixture: ComponentFixture<TenantListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantListingTableComponent, HttpClientTestingModule, NoopAnimationsModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
