import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryStructureComponentListingTableComponent } from './salary-structure-component-listing-table.component';

describe('SalaryStructureComponentListingTableComponent', () => {
  let component: SalaryStructureComponentListingTableComponent;
  let fixture: ComponentFixture<SalaryStructureComponentListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryStructureComponentListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryStructureComponentListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
