import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDeductionListingTableComponent } from './employee-deduction-listing-table.component';

describe('EmployeeDeductionListingTableComponent', () => {
  let component: EmployeeDeductionListingTableComponent;
  let fixture: ComponentFixture<EmployeeDeductionListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDeductionListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDeductionListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
