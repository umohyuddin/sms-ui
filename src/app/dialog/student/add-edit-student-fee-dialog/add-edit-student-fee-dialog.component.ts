import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Fee } from '../../../models/student/fee.model';
import { FeeService } from '../../../services/student/fee.service';
import { Student } from '../../../models/student/student.model';
import { StudentService } from '../../../services/student/student.service';
@Component({
  selector: 'app-add-edit-student-fee-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-student-fee-dialog.component.html',
  styleUrl: './add-edit-student-fee-dialog.component.scss'
})
export class AddEditStudentFeeDialogComponent implements OnInit {

  months = [
      { name: 'January', value: 1 },
      { name: 'February', value: 2 },
      { name: 'March', value: 3 },
      { name: 'April', value: 4 },
      { name: 'May', value: 5 },
      { name: 'June', value: 6 },
      { name: 'July', value: 7 },
      { name: 'August', value: 8 },
      { name: 'September', value: 9 },
      { name: 'October', value: 10 },
      { name: 'November', value: 11 },
      { name: 'December', value: 12 }
    ];
  fee: Fee = new Fee();
  isSaved: boolean = true;
  students: Student[] = [];
  years: number[] = [];
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  constructor(
    private dialogRef: MatDialogRef<AddEditStudentFeeDialogComponent>,
    private feeService: FeeService,
    private studentService: StudentService,
    @Inject(MAT_DIALOG_DATA) public data: Fee | null
  ) {
    if (data) {
      this.fee = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }
  ngOnInit() {
    this.loadStudents();
    this.generateYears();
    this.fee.year = this.selectedYear.toString();
    this.fee.month = this.selectedMonth;

  }
  loadStudents(){
    this.studentService.getAllStudent().subscribe({
      next: (res) => { this.students = res; },
      error: (err) => { console.log("Failed to fetch students");}
    })
  }
  private generateYears() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10; // 10 years in the past
    const endYear = currentYear + 10;   // 10 years in the future
    
    for (let year = startYear; year <= endYear; year++) {
      this.years.push(year);
    }
  }

  save() {
    if(this.isSaved)
    {
      this.feeService.updateFee(this.fee).subscribe({
        next: (res) => console.log('Fee updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.feeService.craeteStudentFee(this.fee).subscribe({
        next: (res) => console.log('Fee created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.fee);
    
  }

  close() {
    this.dialogRef.close();
  }




}
