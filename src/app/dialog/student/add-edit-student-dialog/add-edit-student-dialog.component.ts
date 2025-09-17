import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Student } from '../../../models/student/student.model';
import { StudentService } from '../../../services/student/student.service';
import { Campus } from '../../../models/institute/campus.model';
import { CampusService } from '../../../services/institute/campus.service';
import { Department } from '../../../models/institute/department.model';
import { DepartmentService } from '../../../services/institute/department.service';

@Component({
  selector: 'app-add-edit-student-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-student-dialog.component.html',
  styleUrl: './add-edit-student-dialog.component.scss'
})
export class AddEditStudentDialogComponent implements OnInit {

  student: Student = new Student();
  campuses: Campus[] = [];
  departments: Department[] = [];
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditStudentDialogComponent>,
    private studentService: StudentService,
    private departmentService: DepartmentService,
    private campusService: CampusService,
    @Inject(MAT_DIALOG_DATA) public data: Student | null
  ) {
    if (data) {
      this.student = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  ngOnInit(): void {
    this.loadCampuses();
    this.loadDeparments();
  }

  loadCampuses(){
    this.campusService.getAllCampus().subscribe({
      next: (res) => {this.campuses = res;},
      error: (err) => {console.log("Failed to fetch campuses");}
    })
  }

  loadDeparments(){
    this.departmentService.getAllDeparments().subscribe({
      next: (res) => { this.departments = res; },
      error: (err) => { console.log("failed to fetch departments");}
    })
  }
  
  save() {
    if(this.isSaved)
    {
      this.studentService.updateStudent(this.student).subscribe({
        next: (res) => console.log('Student updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.studentService.craeteStudent(this.student).subscribe({
        next: (res) => console.log('Student created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.student);
    
  }

  close() {
    this.dialogRef.close();
  }
}
