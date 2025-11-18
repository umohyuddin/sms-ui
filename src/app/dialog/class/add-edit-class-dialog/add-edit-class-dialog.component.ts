import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sclass } from '../../../models/class/sclass.model';
import { SclassService } from '../../../services/class/sclass.service';
import { Campus } from '../../../models/institute/campus.model';
import { CampusService } from '../../../services/institute/campus.service';
import { Employee } from '../../../models/employee/employee.model';
import { EmployeeService } from '../../../services/employee/employee.service';
import { GlobalService } from '../../../services/global/global.service';
@Component({
  selector: 'app-add-edit-class-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-class-dialog.component.html',
  styleUrl: './add-edit-class-dialog.component.scss'
})
export class AddEditClassDialogComponent implements OnInit{

  sclass: Sclass = new Sclass();
  campus: Campus[] = [];
  teachers: Employee[] = [];
  isSaved: boolean = true;

  constructor(
    private globalService: GlobalService,
    private dialogRef: MatDialogRef<AddEditClassDialogComponent>,
    private sclassService: SclassService,
    private campusService: CampusService,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: Sclass | null
  ) {
    if (data) {
      this.sclass = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }
  
  ngOnInit(): void {
    this.loadCampus();
    this.loadTeachers();
  }

  loadTeachers(){
    this.employeeService.getAllEmployee().subscribe({
      next: (res) => { this.teachers = res;},
      error:(err) => { console.log("Failed to fetch teacher list"); }
    })
  }

  loadCampus(){
    this.campusService.getAllCampus().subscribe({
      next: (res) => { this.campus = res; },
      error: (err) => { console.log("Failed to fetch campus list"); }
    })
  }

  save() {
    if(this.isSaved)
    {
      this.sclassService.updateClass(this.sclass).subscribe({
        next: (res) => console.log('Sclass updated:', res),
        error: (err) => console.error(err)
      });

    }else{
      this.sclass.campusId = this.globalService.getCampus().id??-1;
      this.sclassService.createClass(this.sclass).subscribe({
        next: (res) => console.log('Sclass created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.sclass);
    
  }

  close() {
    this.dialogRef.close();
  }

}
