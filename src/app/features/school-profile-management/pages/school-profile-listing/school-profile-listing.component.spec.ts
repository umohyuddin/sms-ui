import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolProfileListingComponent } from './school-profile-listing.component';

describe('SchoolProfileListingComponent', () => {
  let component: SchoolProfileListingComponent;
  let fixture: ComponentFixture<SchoolProfileListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolProfileListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolProfileListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
