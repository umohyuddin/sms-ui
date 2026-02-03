import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesListingTableComponent } from './roles-listing-table.component';

describe('RolesListingTableComponent', () => {
  let component: RolesListingTableComponent;
  let fixture: ComponentFixture<RolesListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
