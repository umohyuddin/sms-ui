import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAdvanceListingTableComponent } from './employee-advance-listing-table.component';

describe('EmployeeAdvanceListingTableComponent', () => {
  let component: EmployeeAdvanceListingTableComponent;
  let fixture: ComponentFixture<EmployeeAdvanceListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAdvanceListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAdvanceListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
