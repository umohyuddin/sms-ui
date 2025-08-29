import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEmployeeAttendanceDialogComponent } from './add-edit-employee-attendance-dialog.component';

describe('AddEditEmployeeAttendanceDialogComponent', () => {
  let component: AddEditEmployeeAttendanceDialogComponent;
  let fixture: ComponentFixture<AddEditEmployeeAttendanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditEmployeeAttendanceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditEmployeeAttendanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
