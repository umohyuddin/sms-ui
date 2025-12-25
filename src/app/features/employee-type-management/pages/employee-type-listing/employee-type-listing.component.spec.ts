import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTypeListingComponent } from './employee-type-listing.component';

describe('EmployeeTypeListingComponent', () => {
  let component: EmployeeTypeListingComponent;
  let fixture: ComponentFixture<EmployeeTypeListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTypeListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTypeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
