import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPeriodListingComponent } from './payroll-period-listing.component';

describe('PayrollPeriodListingComponent', () => {
  let component: PayrollPeriodListingComponent;
  let fixture: ComponentFixture<PayrollPeriodListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollPeriodListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollPeriodListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
