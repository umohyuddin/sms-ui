import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySlipListingTableComponent } from './salary-slip-listing-table.component';

describe('SalarySlipListingTableComponent', () => {
  let component: SalarySlipListingTableComponent;
  let fixture: ComponentFixture<SalarySlipListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalarySlipListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalarySlipListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
