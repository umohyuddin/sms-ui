import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Attendance } from '../../../models/student/attendance.modelinterface';
import { AttendanceService } from '../../../services/student/attendance.service';
@Component({
  selector: 'app-add-edit-student-attendance-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-student-attendance-dialog.component.html',
  styleUrl: './add-edit-student-attendance-dialog.component.scss'
})
export class AddEditStudentAttendanceDialogComponent {
  
  attendance: Attendance = {};
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditStudentAttendanceDialogComponent>,
    private attendanceService: AttendanceService,
    @Inject(MAT_DIALOG_DATA) public data: Attendance | null
  ) {
    if (data) {
      this.attendance = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  save() {
    if(this.isSaved)
    {
      this.attendanceService.updateStudentAttendance(this.attendance).subscribe({
        next: (res) => console.log('Attendance updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.attendanceService.craeteStudentAttendance(this.attendance).subscribe({
        next: (res) => console.log('Attendance created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.attendance);
    
  }

  close() {
    this.dialogRef.close();
  }

}
