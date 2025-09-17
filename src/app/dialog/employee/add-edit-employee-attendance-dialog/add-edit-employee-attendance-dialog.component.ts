import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeAttendance } from '../../../models/employee/employee-attendance.model';
import { EmployeeAttendanceService } from '../../../services/employee/employee-attendance.service';
import { Employee } from '../../../models/employee/employee.model';
import { EmployeeService } from '../../../services/employee/employee.service';
@Component({
  selector: 'app-add-edit-employee-attendance-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-employee-attendance-dialog.component.html',
  styleUrl: './add-edit-employee-attendance-dialog.component.scss'
})
export class AddEditEmployeeAttendanceDialogComponent implements OnInit {
  employeeAttendance: EmployeeAttendance = new EmployeeAttendance();
  employee: Employee[] = [];
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditEmployeeAttendanceDialogComponent>,
    private employeeAttendanceService: EmployeeAttendanceService,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeAttendance | null
  ) {
    if (data) {
      this.employeeAttendance = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }
  ngOnInit(): void {
    this.loadEmployee();
  }
  loadEmployee(){
    this.employeeService.getAllEmployee().subscribe({
      next: res=>{
        this.employee = res;
      },
      error: err=>{
          console.error("Failed to fetch Employee");
      }
    });
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
