import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Department } from '../../../../models/institute/department.modelinterface';
import { DepartmentService } from '../../../../services/institute/department.service';
import { Campus } from '../../../../models/institute/campus.modelinterface';
import { CampusService } from '../../../../services/institute/campus.service';
@Component({
  selector: 'app-add-edit-department-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-department-dialog.component.html',
  styleUrl: './add-edit-department-dialog.component.scss'
})
export class AddEditDepartmentDialogComponent implements OnInit {
  isSaved: boolean = true;
  department: Department ={};
  campus: Campus[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddEditDepartmentDialogComponent>,
    private departmentService: DepartmentService,
    private campusService: CampusService,
    @Inject(MAT_DIALOG_DATA) public data: Department | null
  ) {
    if (data) {
      this.department = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }
  ngOnInit(): void {
    this.loadCampus();
  }
  loadCampus() {
    this.campusService.getAllCampus().subscribe({
      next: (res: Campus[]) => {
        this.campus = res;
      },
      error: (err) => console.error('Failed to load campus', err)
    });
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
