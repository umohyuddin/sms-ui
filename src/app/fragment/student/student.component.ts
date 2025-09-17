import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Student } from '../../models/student/student.model';
import { StudentService } from '../../services/student/student.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEditStudentDialogComponent } from '../../dialog/student/add-edit-student-dialog/add-edit-student-dialog.component';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent {

  students: Student[] = [];
  filteredList: Student[] = [];
  searchTerm = '';
  sortColumn: keyof Student | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private studentService: StudentService,
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
        if (this.router.url.includes('/dashboard/student')) {
          this.load();
        }
      });
  }

  load(): void {
    this.studentService.getAllStudent().subscribe({
      next: res => {
        this.students = res;
        this.filteredList = [...this.students];
      },
      error: err => console.error('Failed to load Student', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredList = this.students.filter(
      u => u.firstName?.toLowerCase().includes(term) || u.lastName?.toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Student | '', keepDirection = false): void {
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
    const dialogRef = this.dialog.open(AddEditStudentDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.students.push(result);
        this.filteredList = [...this.students];
      }
    });
  }

  onEdit(pStudent: Student, index: number) {
    const dialogRef = this.dialog.open(AddEditStudentDialogComponent, {
      width: '400px',
      data: pStudent
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.students[index] = result;
        this.filteredList = [...this.students];
      }
    });
  }
  onDelete(pStudent: Student, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pStudent
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteStudent(pStudent).subscribe({
            next: res => {
              console.log('Student Deleted:', res);
              this.students.splice(index,1);
              this.filteredList = [...this.students];
            },
            error: err => console.error('Failed to delete Student', err)
          });
      }
    });
  }
}
