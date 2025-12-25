import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPeriodCreateFormComponent } from './payroll-period-create-form.component';

describe('PayrollPeriodCreateFormComponent', () => {
  let component: PayrollPeriodCreateFormComponent;
  let fixture: ComponentFixture<PayrollPeriodCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollPeriodCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollPeriodCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
