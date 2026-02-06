import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesListingTableComponent } from './modules-listing-table.component';

describe('ModulesListingTableComponent', () => {
  let component: ModulesListingTableComponent;
  let fixture: ComponentFixture<ModulesListingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ModulesListingTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulesListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
