import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDeductionDetailsComponent } from './employee-deduction-details.component';

describe('EmployeeDeductionDetailsComponent', () => {
  let component: EmployeeDeductionDetailsComponent;
  let fixture: ComponentFixture<EmployeeDeductionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDeductionDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDeductionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
