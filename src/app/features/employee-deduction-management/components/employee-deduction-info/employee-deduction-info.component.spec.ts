import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDeductionInfoComponent } from './employee-deduction-info.component';

describe('EmployeeDeductionInfoComponent', () => {
  let component: EmployeeDeductionInfoComponent;
  let fixture: ComponentFixture<EmployeeDeductionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDeductionInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDeductionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
