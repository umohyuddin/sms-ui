import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Enrollment } from '../../../models/course/enrollment.model';
import { EnrollmentService } from '../../../services/course/enrollment.service';
import { Student } from '../../../models/student/student.model';
import { StudentService } from '../../../services/student/student.service';
import { Course } from '../../../models/course/course.model';
import { CourseService } from '../../../services/course/course.service';

@Component({
  selector: 'app-add-edit-enrollment-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-enrollment-dialog.component.html',
  styleUrl: './add-edit-enrollment-dialog.component.scss'
})

export class AddEditEnrollmentDialogComponent implements OnInit{

  enrollment: Enrollment = new Enrollment();
  students: Student[] = [];
  courses: Course[] = [];
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditEnrollmentDialogComponent>,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private courseService: CourseService,
    @Inject(MAT_DIALOG_DATA) public data: Enrollment | null
  ) {
    if (data) {
      this.enrollment = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }
  ngOnInit(): void {
    this.loadCourses();
    this.loadStudents();
    
  }
  loadCourses(){
    this.courseService.getAllCourse().subscribe({
      next: (res) => {this.courses=res;},
      error: (err) => { console.log("Failed to fetch course list");}
    })
  }
  loadStudents(){
    this.studentService.getAllStudent().subscribe({
      next: (res)=>{this.students=res;},
      error: (err)=>{ console.log("failed to fetch student list");}
    })
  }
  save() {
    if(this.isSaved)
    {
      this.enrollmentService.updateEnrollement(this.enrollment).subscribe({
        next: (res) => console.log('Enrollment updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.enrollmentService.createEnrollement(this.enrollment).subscribe({
        next: (res) => console.log('Enrollment created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.enrollment);
    
  }

  close() {
    this.dialogRef.close();
  }

}
