import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryStructureListingComponent } from './salary-structure-listing.component';

describe('SalaryStructureListingComponent', () => {
  let component: SalaryStructureListingComponent;
  let fixture: ComponentFixture<SalaryStructureListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryStructureListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryStructureListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
