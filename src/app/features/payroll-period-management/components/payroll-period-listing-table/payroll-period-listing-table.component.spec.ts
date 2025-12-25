import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPeriodListingTableComponent } from './payroll-period-listing-table.component';

describe('PayrollPeriodListingTableComponent', () => {
  let component: PayrollPeriodListingTableComponent;
  let fixture: ComponentFixture<PayrollPeriodListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollPeriodListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollPeriodListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
