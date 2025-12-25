import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationListingTableComponent } from './designation-listing-table.component';

describe('DesignationListingTableComponent', () => {
  let component: DesignationListingTableComponent;
  let fixture: ComponentFixture<DesignationListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
