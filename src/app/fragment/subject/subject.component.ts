import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subject } from '../../models/class/subject.model';
import { CourseService } from '../../services/class/course.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEditSubjectDialogComponent } from '../../dialog/class/add-edit-subject-dialog/add-edit-subject-dialog.component';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.scss'
})
export class SubjectComponent {

  subjectList: Subject[] = [];
  filteredList: Subject[] = [];
  searchTerm = '';
  sortColumn: keyof Subject | '' = '';
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
        this.subjectList = res;
        this.filteredList = [...this.subjectList];
      },
      error: err => console.error('Failed to load Subject', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredList = this.subjectList.filter(
      u => u.name?.toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Subject | '', keepDirection = false): void {
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
    const dialogRef = this.dialog.open(AddEditSubjectDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subjectList.push(result);
        this.filteredList = [...this.subjectList];
      }
    });
  }

  onEdit(pSubject: Subject, index: number) {
    const dialogRef = this.dialog.open(AddEditSubjectDialogComponent, {
      width: '400px',
      data: pSubject
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subjectList[index] = result;
        this.filteredList = [...this.subjectList];
      }
    });
  }
  onDelete(pSubject: Subject, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pSubject
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.deleteCourse(pSubject).subscribe({
            next: res => {
              console.log('Subject Deleted:', res);
              this.subjectList.splice(index,1);
              this.filteredList = [...this.subjectList];
            },
            error: err => console.error('Failed to delete Subject', err)
          });
      }
    });
  }

}
