import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryComponentListingTableComponent } from './salary-component-listing-table.component';

describe('SalaryComponentListingTableComponent', () => {
  let component: SalaryComponentListingTableComponent;
  let fixture: ComponentFixture<SalaryComponentListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryComponentListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryComponentListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
