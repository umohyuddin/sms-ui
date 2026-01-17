import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryPayComponent } from './employee-salary-pay.component';

describe('EmployeeSalaryPayComponent', () => {
  let component: EmployeeSalaryPayComponent;
  let fixture: ComponentFixture<EmployeeSalaryPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSalaryPayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSalaryPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
