import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Course } from '../../models/course/course.model';
import { CourseService } from '../../services/course/course.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEditCourseDialogComponent } from '../../dialog/course/add-edit-course-dialog/add-edit-course-dialog.component';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class CourseComponent {

  courseList: Course[] = [];
  filteredList: Course[] = [];
  searchTerm = '';
  sortColumn: keyof Course | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.load();

    // Reload if the same route is clicked again
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url.includes('/dashboard/course')) {
          this.load();
        }
      });
  }

  load(): void {
    this.courseService.getAllCourse().subscribe({
      next: res => {
        this.courseList = res;
        this.filteredList = [...this.courseList];
      },
      error: err => console.error('Failed to load Course', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredList = this.courseList.filter(
      u => u.courseName?.toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Course | '', keepDirection = false): void {
    if (!column) return;
    if (!keepDirection) {
      this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortColumn = column;

    this.filteredList.sort((a, b) => {
      const valA = (a[column] || '').toString().toLowerCase();
      const valB = (b[column] || '').toString().toLowerCase();
      return valA < valB ? (this.sortDirection === 'asc' ? -1 : 1) : valA > valB ? (this.sortDirection === 'asc' ? 1 : -1) : 0;
    });
  }
  onAdd() {
    const dialogRef = this.dialog.open(AddEditCourseDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseList.push(result);
        this.filteredList = [...this.courseList];
      }
    });
  }

  onEdit(pCourse: Course, index: number) {
    const dialogRef = this.dialog.open(AddEditCourseDialogComponent, {
      width: '400px',
      data: pCourse
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseList[index] = result;
        this.filteredList = [...this.courseList];
      }
    });
  }
  onDelete(pCourse: Course, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pCourse
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.deleteCourse(pCourse).subscribe({
            next: res => {
              console.log('Course Deleted:', res);
              this.courseList.splice(index,1);
              this.filteredList = [...this.courseList];
            },
            error: err => console.error('Failed to delete Course', err)
          });
      }
    });
  }

}
