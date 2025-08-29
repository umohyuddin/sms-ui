import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from '../../../models/employee/employee.modelinterface';
import { EmployeeService} from '../../../services/employee/employee.service';
@Component({
  selector: 'app-add-edit-employee-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-employee-dialog.component.html',
  styleUrl: './add-edit-employee-dialog.component.scss'
})
export class AddEditEmployeeDialogComponent {
  employee: Employee = {};
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditEmployeeDialogComponent>,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: Employee | null
  ) {
    if (data) {
      this.employee = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  save() {
    if(this.isSaved)
    {
      this.employeeService.updateEmployee(this.employee).subscribe({
        next: (res) => console.log('Employee updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.employeeService.createEmployee(this.employee).subscribe({
        next: (res) => console.log('Employee created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.employee);
    
  }

  close() {
    this.dialogRef.close();
  }

}
