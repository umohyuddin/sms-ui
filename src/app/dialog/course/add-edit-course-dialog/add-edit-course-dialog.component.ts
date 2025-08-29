import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Course } from '../../../models/course/course.modelinterface';
import { CourseService } from '../../../services/course/course.service';

@Component({
  selector: 'app-add-edit-course-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-course-dialog.component.html',
  styleUrl: './add-edit-course-dialog.component.scss'
})
export class AddEditCourseDialogComponent {

  course: Course = {};
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditCourseDialogComponent>,
    private courseService: CourseService,
    @Inject(MAT_DIALOG_DATA) public data: Course | null
  ) {
    if (data) {
      this.course = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
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
