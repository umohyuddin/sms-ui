import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from '../../../models/class/subject.model'
import { CourseService } from '../../../services/class/course.service';
import { Employee } from '../../../models/employee/employee.model';
import { EmployeeService } from '../../../services/employee/employee.service';
import { Department } from '../../../models/institute/department.model';
import { DepartmentService } from '../../../services/institute/department.service';

@Component({
  selector: 'app-add-edit-subject-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-subject-dialog.component.html',
  styleUrl: './add-edit-subject-dialog.component.scss'
})
export class AddEditSubjectDialogComponent implements OnInit {

  subject: Subject = new Subject();
  theachers: Employee[] = [];
  department: Department[] = [];
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditSubjectDialogComponent>,
    private courseService: CourseService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: Subject | null
  ) {
    if (data) {
      this.subject = { ...data };
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
      this.courseService.updateCourse(this.subject).subscribe({
        next: (res) => console.log('subject updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.courseService.createCourse(this.subject).subscribe({
        next: (res) => console.log('subject created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.subject);
    
  }

  close() {
    this.dialogRef.close();
  }

}
