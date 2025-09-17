import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Attendance } from '../../../models/student/attendance.model';
import { AttendanceService } from '../../../services/student/attendance.service';
import { Student } from '../../../models/student/student.model';
import { StudentService } from '../../../services/student/student.service';
import { Course } from '../../../models/course/course.model';
import { CourseService } from '../../../services/course/course.service';
@Component({
  selector: 'app-add-edit-student-attendance-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-student-attendance-dialog.component.html',
  styleUrl: './add-edit-student-attendance-dialog.component.scss'
})
export class AddEditStudentAttendanceDialogComponent implements OnInit {
  
  attendance: Attendance = new Attendance();
  students: Student[] = [];
  courses: Course[] = [];
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditStudentAttendanceDialogComponent>,
    private attendanceService: AttendanceService,
    private coursesService: CourseService,
    private studentServuce: StudentService,
    @Inject(MAT_DIALOG_DATA) public data: Attendance | null
  ) {
    if (data) {
      this.attendance = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }
  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
  }
  loadStudents(){
    this.studentServuce.getAllStudent().subscribe({
      next: (res)=>{ this.students = res; },
      error: (err) => {console.log("Failed to fetch students");}
    })
  }
  loadCourses(){
    this.coursesService.getAllCourse().subscribe({
      next: (res) => { this.courses = res; },
      error: (err) => { console.log("Failed to fetcg courses");}
    })
  }
  save() {
    if(this.isSaved)
    {
      this.attendanceService.updateStudentAttendance(this.attendance).subscribe({
        next: (res) => console.log('Attendance updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.attendanceService.craeteStudentAttendance(this.attendance).subscribe({
        next: (res) => console.log('Attendance created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.attendance);
    
  }

  close() {
    this.dialogRef.close();
  }

}
