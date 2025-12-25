import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryPaymentListingComponent } from './salary-payment-listing.component';

describe('SalaryPaymentListingComponent', () => {
  let component: SalaryPaymentListingComponent;
  let fixture: ComponentFixture<SalaryPaymentListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryPaymentListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryPaymentListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
