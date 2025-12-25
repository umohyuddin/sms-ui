import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryPaymentInfoComponent } from './salary-payment-info.component';

describe('SalaryPaymentInfoComponent', () => {
  let component: SalaryPaymentInfoComponent;
  let fixture: ComponentFixture<SalaryPaymentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryPaymentInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryPaymentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
