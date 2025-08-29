import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Enrollment } from '../../../models/course/enrollment.modelinterface';
import { EnrollmentService } from '../../../services/course/enrollment.service';

@Component({
  selector: 'app-add-edit-enrollment-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-enrollment-dialog.component.html',
  styleUrl: './add-edit-enrollment-dialog.component.scss'
})

export class AddEditEnrollmentDialogComponent {

  enrollment: Enrollment = {};
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditEnrollmentDialogComponent>,
    private enrollmentService: EnrollmentService,
    @Inject(MAT_DIALOG_DATA) public data: Enrollment | null
  ) {
    if (data) {
      this.enrollment = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  save() {
    if(this.isSaved)
    {
      this.enrollmentService.updateEnrollement(this.enrollment).subscribe({
        next: (res) => console.log('Enrollment updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.enrollmentService.createEnrollement(this.enrollment).subscribe({
        next: (res) => console.log('Enrollment created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.enrollment);
    
  }

  close() {
    this.dialogRef.close();
  }

}
