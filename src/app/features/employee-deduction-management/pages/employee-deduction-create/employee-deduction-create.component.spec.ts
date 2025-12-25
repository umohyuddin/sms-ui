import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDeductionCreateComponent } from './employee-deduction-create.component';

describe('EmployeeDeductionCreateComponent', () => {
  let component: EmployeeDeductionCreateComponent;
  let fixture: ComponentFixture<EmployeeDeductionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDeductionCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDeductionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
