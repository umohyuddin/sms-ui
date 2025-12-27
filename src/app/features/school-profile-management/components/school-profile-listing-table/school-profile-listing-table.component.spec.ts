import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolProfileListingTableComponent } from './school-profile-listing-table.component';

describe('SchoolProfileListingTableComponent', () => {
  let component: SchoolProfileListingTableComponent;
  let fixture: ComponentFixture<SchoolProfileListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolProfileListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolProfileListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
