import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Assessment } from '../../../models/course/assessment.modelinterface';
import { AssessmentService } from '../../../services/course/assessment.service';
@Component({
  selector: 'app-add-edit-assessment-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-assessment-dialog.component.html',
  styleUrl: './add-edit-assessment-dialog.component.scss'
})
export class AddEditAssessmentDialogComponent {
  asessment: Assessment = {};
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditAssessmentDialogComponent>,
    private assessmentService: AssessmentService,
    @Inject(MAT_DIALOG_DATA) public data: Assessment | null
  ) {
    if (data) {
      this.asessment = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  save() {
    if(this.isSaved)
    {
      this.assessmentService.updateAssessment(this.asessment).subscribe({
        next: (res) => console.log('Assessment updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.assessmentService.createAssessment(this.asessment).subscribe({
        next: (res) => console.log('Assessment created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.asessment);
    
  }

  close() {
    this.dialogRef.close();
  }
}
