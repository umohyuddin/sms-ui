import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPeriodCreateComponent } from './payroll-period-create.component';

describe('PayrollPeriodCreateComponent', () => {
  let component: PayrollPeriodCreateComponent;
  let fixture: ComponentFixture<PayrollPeriodCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollPeriodCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollPeriodCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
