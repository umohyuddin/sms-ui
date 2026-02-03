import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionListingTableComponent } from './permission-listing-table.component';

describe('PermissionListingTableComponent', () => {
  let component: PermissionListingTableComponent;
  let fixture: ComponentFixture<PermissionListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
