import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Course } from '../../../models/course/course.model';
import { CourseService } from '../../../services/course/course.service';
import { Employee } from '../../../models/employee/employee.model';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Department } from '../../../models/institute/department.model';
import { DepartmentService } from '../../../services/institute/department.service';

@Component({
  selector: 'app-add-edit-course-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-course-dialog.component.html',
  styleUrl: './add-edit-course-dialog.component.scss'
})
export class AddEditCourseDialogComponent implements OnInit {

  course: Course = new Course();
  theachers: Employee[] = [];
  department: Department[] = [];
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditCourseDialogComponent>,
    private courseService: CourseService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: Course | null
  ) {
    if (data) {
      this.course = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }
  ngOnInit(): void {
    this.loadDepartments();
    this.loadTeachers();
  }

  loadTeachers(){
    this.employeeService.getAllEmployee().subscribe({
      next: (res) => { this.theachers = res; },
      error: (err) => { console.log("Failde to fetch teacher list");}
    })
  }
  loadDepartments(){
    this.departmentService.getAllDeparments().subscribe({
      next: (res) => { this.department = res; },
      error: (err) => { console.log("Failed to fetch department list");}
    })
  }
  save() {
    if(this.isSaved)
    {
      this.courseService.updateCourse(this.course).subscribe({
        next: (res) => console.log('Course updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.courseService.createCourse(this.course).subscribe({
        next: (res) => console.log('Course created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.course);
    
  }

  close() {
    this.dialogRef.close();
  }

}
