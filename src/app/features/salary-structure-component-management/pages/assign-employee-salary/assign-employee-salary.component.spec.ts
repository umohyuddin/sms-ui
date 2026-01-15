import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEmployeeSalaryComponent } from './assign-employee-salary.component';

describe('AssignEmployeeSalaryComponent', () => {
  let component: AssignEmployeeSalaryComponent;
  let fixture: ComponentFixture<AssignEmployeeSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignEmployeeSalaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignEmployeeSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
