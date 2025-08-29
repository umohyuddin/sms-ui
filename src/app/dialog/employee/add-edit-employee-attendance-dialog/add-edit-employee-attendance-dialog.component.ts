import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeAttendance } from '../../../models/employee/employee-attendance.modelinterface';
import { EmployeeAttendanceService } from '../../../services/employee/employee-attendance.service';
@Component({
  selector: 'app-add-edit-employee-attendance-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-employee-attendance-dialog.component.html',
  styleUrl: './add-edit-employee-attendance-dialog.component.scss'
})
export class AddEditEmployeeAttendanceDialogComponent {
  employeeAttendance: EmployeeAttendance = {};
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditEmployeeAttendanceDialogComponent>,
    private employeeAttendanceService: EmployeeAttendanceService,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeAttendance | null
  ) {
    if (data) {
      this.employeeAttendance = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  save() {
    if(this.isSaved)
    {
      this.employeeAttendanceService.updateEmployeeAttendance(this.employeeAttendance).subscribe({
        next: (res) => console.log('EmployeeAttendance updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.employeeAttendanceService.createEmployeeAttendance(this.employeeAttendance).subscribe({
        next: (res) => console.log('EmployeeAttendance created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.employeeAttendance);
    
  }

  close() {
    this.dialogRef.close();
  }

}
