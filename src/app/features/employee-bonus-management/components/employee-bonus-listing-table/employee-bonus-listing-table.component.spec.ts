import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBonusListingTableComponent } from './employee-bonus-listing-table.component';

describe('EmployeeBonusListingTableComponent', () => {
  let component: EmployeeBonusListingTableComponent;
  let fixture: ComponentFixture<EmployeeBonusListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeBonusListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeBonusListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
