import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAdvanceListingComponent } from './employee-advance-listing.component';

describe('EmployeeAdvanceListingComponent', () => {
  let component: EmployeeAdvanceListingComponent;
  let fixture: ComponentFixture<EmployeeAdvanceListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAdvanceListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAdvanceListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
