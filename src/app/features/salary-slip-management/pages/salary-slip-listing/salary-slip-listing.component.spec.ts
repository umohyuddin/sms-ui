import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySlipListingComponent } from './salary-slip-listing.component';

describe('SalarySlipListingComponent', () => {
  let component: SalarySlipListingComponent;
  let fixture: ComponentFixture<SalarySlipListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalarySlipListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalarySlipListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
