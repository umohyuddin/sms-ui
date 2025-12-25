import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDeductionCreateFormComponent } from './employee-deduction-create-form.component';

describe('EmployeeDeductionCreateFormComponent', () => {
  let component: EmployeeDeductionCreateFormComponent;
  let fixture: ComponentFixture<EmployeeDeductionCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDeductionCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDeductionCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
