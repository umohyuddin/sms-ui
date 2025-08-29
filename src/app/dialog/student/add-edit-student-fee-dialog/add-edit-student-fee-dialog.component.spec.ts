import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditStudentFeeDialogComponent } from './add-edit-student-fee-dialog.component';

describe('AddEditStudentFeeDialogComponent', () => {
  let component: AddEditStudentFeeDialogComponent;
  let fixture: ComponentFixture<AddEditStudentFeeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditStudentFeeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditStudentFeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
