import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryStructureComponentListingComponent } from './salary-structure-component-listing.component';

describe('SalaryStructureComponentListingComponent', () => {
  let component: SalaryStructureComponentListingComponent;
  let fixture: ComponentFixture<SalaryStructureComponentListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryStructureComponentListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryStructureComponentListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
