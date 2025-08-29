import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeRole } from '../../../models/employee/employee-role.modelinterface';
import { EmployeeRoleService } from '../../../services/employee/employee-role.service';
@Component({
  selector: 'app-add-edit-employee-role-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-employee-role-dialog.component.html',
  styleUrl: './add-edit-employee-role-dialog.component.scss'
})
export class AddEditEmployeeRoleDialogComponent {
  employeeRole: EmployeeRole = {};
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditEmployeeRoleDialogComponent>,
    private employeeRoleService: EmployeeRoleService,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeRole | null
  ) {
    if (data) {
      this.employeeRole = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  save() {
    if(this.isSaved)
    {
      this.employeeRoleService.updateEmployeeRole(this.employeeRole).subscribe({
        next: (res) => console.log('EmployeeRole updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.employeeRoleService.createEmployeeRole(this.employeeRole).subscribe({
        next: (res) => console.log('EmployeeRole created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.employeeRole);
    
  }

  close() {
    this.dialogRef.close();
  }

}
