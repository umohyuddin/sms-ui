import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTimeTableComponent } from './add-edit-time-table.component';

describe('AddEditTimeTableComponent', () => {
  let component: AddEditTimeTableComponent;
  let fixture: ComponentFixture<AddEditTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditTimeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
