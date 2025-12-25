import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryCreateFormComponent } from './employee-salary-create-form.component';

describe('EmployeeSalaryCreateFormComponent', () => {
  let component: EmployeeSalaryCreateFormComponent;
  let fixture: ComponentFixture<EmployeeSalaryCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSalaryCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSalaryCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
