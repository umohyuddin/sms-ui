import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryComponentListingComponent } from './salary-component-listing.component';

describe('SalaryComponentListingComponent', () => {
  let component: SalaryComponentListingComponent;
  let fixture: ComponentFixture<SalaryComponentListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryComponentListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryComponentListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
