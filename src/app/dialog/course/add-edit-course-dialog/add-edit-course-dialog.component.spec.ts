import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCourseDialogComponent } from './add-edit-course-dialog.component';

describe('AddEditCourseDialogComponent', () => {
  let component: AddEditCourseDialogComponent;
  let fixture: ComponentFixture<AddEditCourseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCourseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCourseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
