import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Department } from '../../../../models/institute/department.modelinterface';
import { DepartmentService } from '../../../../services/institute/department.service';
@Component({
  selector: 'app-add-edit-department-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-department-dialog.component.html',
  styleUrl: './add-edit-department-dialog.component.scss'
})
export class AddEditDepartmentDialogComponent {
  isSaved: boolean = true;
  department: Department ={};

  constructor(
      private dialogRef: MatDialogRef<AddEditDepartmentDialogComponent>,
      private departmentService: DepartmentService,
      @Inject(MAT_DIALOG_DATA) public data: Department | null
    ) {
      if (data) {
        this.department = { ...data };
        this.isSaved = true;
      }else{
        this.isSaved = false;
      }
    }
  
    save() {
      if(this.isSaved)
      {
        this.departmentService.updateDeparment(this.department).subscribe({
          next: (res) => console.log('Institute updated:', res),
          error: (err) => console.error(err)
        });
  
      }else{
  
        this.departmentService.createDeparment(this.department).subscribe({
          next: (res) => console.log('Institute created:', res),
          error: (err) => console.error(err)
        });
      }
       this.dialogRef.close(this.department);
      
    }
  
    close() {
      this.dialogRef.close();
    }

}
