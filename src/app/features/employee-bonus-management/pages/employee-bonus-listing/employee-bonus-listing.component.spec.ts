import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBonusListingComponent } from './employee-bonus-listing.component';

describe('EmployeeBonusListingComponent', () => {
  let component: EmployeeBonusListingComponent;
  let fixture: ComponentFixture<EmployeeBonusListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeBonusListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeBonusListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
