import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDeductionListingComponent } from './employee-deduction-listing.component';

describe('EmployeeDeductionListingComponent', () => {
  let component: EmployeeDeductionListingComponent;
  let fixture: ComponentFixture<EmployeeDeductionListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDeductionListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDeductionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
