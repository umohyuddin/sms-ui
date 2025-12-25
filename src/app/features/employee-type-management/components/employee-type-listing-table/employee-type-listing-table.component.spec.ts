import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTypeListingTableComponent } from './employee-type-listing-table.component';

describe('EmployeeTypeListingTableComponent', () => {
  let component: EmployeeTypeListingTableComponent;
  let fixture: ComponentFixture<EmployeeTypeListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTypeListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTypeListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
