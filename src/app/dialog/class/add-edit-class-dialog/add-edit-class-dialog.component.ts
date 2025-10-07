import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sclass } from '../../../models/class/sclass.model';
import { SclassService } from '../../../services/class/sclass.service';
import { Subject } from '../../../models/class/subject.model';
import { CourseService } from '../../../services/class/course.service';
import { Employee } from '../../../models/employee/employee.model';
import { EmployeeService } from '../../../services/employee/employee.service';
@Component({
  selector: 'app-add-edit-class-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-class-dialog.component.html',
  styleUrl: './add-edit-class-dialog.component.scss'
})
export class AddEditClassDialogComponent implements OnInit{

  sclass: Sclass = new Sclass();
  subjects: Subject[] = [];
  teachers: Employee[] = [];
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditClassDialogComponent>,
    private sclassService: SclassService,
    private courseService: CourseService,
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
    this.loadCourses();
    this.loadTeachers();
  }

  loadTeachers(){
    this.employeeService.getAllEmployee().subscribe({
      next: (res) => { this.teachers = res;},
      error:(err) => { console.log("Failed to fetch teacher list"); }
    })
  }

  loadCourses(){
    this.courseService.getAllCourse().subscribe({
      next: (res) => { this.subjects = res; },
      error: (err) => { console.log("Failed to fetch courses list"); }
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
