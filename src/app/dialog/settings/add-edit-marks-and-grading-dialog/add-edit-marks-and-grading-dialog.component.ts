import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MarksAndgrading } from '../../../models/institute/marks-andgrading.model';
import { MarksAndGradingService } from '../../../services/institute/marks-and-grading.service';
import { GlobalService } from '../../../services/global/global.service';

@Component({
  selector: 'app-add-edit-marks-and-grading-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-marks-and-grading-dialog.component.html',
  styleUrl: './add-edit-marks-and-grading-dialog.component.scss'
})
export class AddEditMarksAndGradingDialogComponent implements OnInit {

  grade: MarksAndgrading = new MarksAndgrading();
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditMarksAndGradingDialogComponent>,
    private marksAndGradingService: MarksAndGradingService,
    private globalService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: MarksAndgrading | null
  ) {
    if (data) {
      this.grade = { ...data };
    }
  }
  ngOnInit(): void {
 
  }

  save() {
    this.grade.instituteId = this.globalService.getInstitute().instituteId??-1;
    this.marksAndGradingService.create(this.grade).subscribe({
      next: (res) => console.log( res),
      error: (err) => console.error(err)
    });
     this.dialogRef.close(this.grade);
    
  }

  close() {
    this.dialogRef.close();
  }


}
