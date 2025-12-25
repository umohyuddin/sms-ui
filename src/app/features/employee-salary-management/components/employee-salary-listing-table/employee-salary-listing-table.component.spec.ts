import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryListingTableComponent } from './employee-salary-listing-table.component';

describe('EmployeeSalaryListingTableComponent', () => {
  let component: EmployeeSalaryListingTableComponent;
  let fixture: ComponentFixture<EmployeeSalaryListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSalaryListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSalaryListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
