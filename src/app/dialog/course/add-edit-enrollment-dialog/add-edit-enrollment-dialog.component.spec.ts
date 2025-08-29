import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEnrollmentDialogComponent } from './add-edit-enrollment-dialog.component';

describe('AddEditEnrollmentDialogComponent', () => {
  let component: AddEditEnrollmentDialogComponent;
  let fixture: ComponentFixture<AddEditEnrollmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditEnrollmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditEnrollmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
