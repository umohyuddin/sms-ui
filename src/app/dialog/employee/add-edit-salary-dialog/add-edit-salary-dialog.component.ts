import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Salary } from '../../../models/employee/salary.modelinterface';
import { SalaryService } from '../../../services/employee/salary.service';

@Component({
  selector: 'app-add-edit-salary-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-salary-dialog.component.html',
  styleUrl: './add-edit-salary-dialog.component.scss'
})
export class AddEditSalaryDialogComponent {

  salary: Salary = {};
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditSalaryDialogComponent>,
    private salaryService: SalaryService,
    @Inject(MAT_DIALOG_DATA) public data: Salary | null
  ) {
    if (data) {
      this.salary = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  save() {
    if(this.isSaved)
    {
      this.salaryService.updateSalary(this.salary).subscribe({
        next: (res) => console.log('Salary updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.salaryService.createSalary(this.salary).subscribe({
        next: (res) => console.log('Salary created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.salary);
    
  }

  close() {
    this.dialogRef.close();
  }
}
