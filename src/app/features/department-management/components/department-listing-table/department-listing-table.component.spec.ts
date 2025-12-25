import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentListingTableComponent } from './department-listing-table.component';

describe('DepartmentListingTableComponent', () => {
  let component: DepartmentListingTableComponent;
  let fixture: ComponentFixture<DepartmentListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentListingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
