import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditStudentAttendanceDialogComponent } from './add-edit-student-attendance-dialog.component';

describe('AddEditStudentAttendanceDialogComponent', () => {
  let component: AddEditStudentAttendanceDialogComponent;
  let fixture: ComponentFixture<AddEditStudentAttendanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditStudentAttendanceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditStudentAttendanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
