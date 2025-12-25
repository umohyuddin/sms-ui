import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryCreateComponent } from './employee-salary-create.component';

describe('EmployeeSalaryCreateComponent', () => {
  let component: EmployeeSalaryCreateComponent;
  let fixture: ComponentFixture<EmployeeSalaryCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSalaryCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSalaryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
