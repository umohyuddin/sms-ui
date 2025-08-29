import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Student } from '../../../models/student/student.modelinterface';
import { StudentService } from '../../../services/student/student.service';

@Component({
  selector: 'app-add-edit-student-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-student-dialog.component.html',
  styleUrl: './add-edit-student-dialog.component.scss'
})
export class AddEditStudentDialogComponent {

  student: Student = {};
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditStudentDialogComponent>,
    private studentService: StudentService,
    @Inject(MAT_DIALOG_DATA) public data: Student | null
  ) {
    if (data) {
      this.student = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  save() {
    if(this.isSaved)
    {
      this.studentService.updateStudent(this.student).subscribe({
        next: (res) => console.log('Student updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.studentService.craeteStudent(this.student).subscribe({
        next: (res) => console.log('Student created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.student);
    
  }

  close() {
    this.dialogRef.close();
  }
}
