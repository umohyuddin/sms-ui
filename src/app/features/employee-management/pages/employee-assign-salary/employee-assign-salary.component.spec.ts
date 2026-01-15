import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAssignSalaryComponent } from './employee-assign-salary.component';

describe('EmployeeAssignSalaryComponent', () => {
  let component: EmployeeAssignSalaryComponent;
  let fixture: ComponentFixture<EmployeeAssignSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAssignSalaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAssignSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
