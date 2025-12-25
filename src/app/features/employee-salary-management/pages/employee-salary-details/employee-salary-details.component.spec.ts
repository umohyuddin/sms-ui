import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryDetailsComponent } from './employee-salary-details.component';

describe('EmployeeSalaryDetailsComponent', () => {
  let component: EmployeeSalaryDetailsComponent;
  let fixture: ComponentFixture<EmployeeSalaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSalaryDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSalaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
