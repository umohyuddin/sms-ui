import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryPaymentListingTableComponent } from './salary-payment-listing-table.component';

describe('SalaryPaymentListingTableComponent', () => {
  let component: SalaryPaymentListingTableComponent;
  let fixture: ComponentFixture<SalaryPaymentListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryPaymentListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryPaymentListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
