import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionListingComponent } from './permission-listing.component';

describe('PermissionListingComponent', () => {
  let component: PermissionListingComponent;
  let fixture: ComponentFixture<PermissionListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
