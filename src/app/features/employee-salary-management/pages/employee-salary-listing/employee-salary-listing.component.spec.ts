import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryListingComponent } from './employee-salary-listing.component';

describe('EmployeeSalaryListingComponent', () => {
  let component: EmployeeSalaryListingComponent;
  let fixture: ComponentFixture<EmployeeSalaryListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSalaryListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSalaryListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
