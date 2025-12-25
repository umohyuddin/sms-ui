import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryPaymentCreateFormComponent } from './salary-payment-create-form.component';

describe('SalaryPaymentCreateFormComponent', () => {
  let component: SalaryPaymentCreateFormComponent;
  let fixture: ComponentFixture<SalaryPaymentCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryPaymentCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryPaymentCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
