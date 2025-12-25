import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryStructureListingTableComponent } from './salary-structure-listing-table.component';

describe('SalaryStructureListingTableComponent', () => {
  let component: SalaryStructureListingTableComponent;
  let fixture: ComponentFixture<SalaryStructureListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryStructureListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryStructureListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
