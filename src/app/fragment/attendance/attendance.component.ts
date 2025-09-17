import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Attendance } from '../../models/student/attendance.model';
import { AttendanceService } from '../../services/student/attendance.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEditStudentAttendanceDialogComponent } from '../../dialog/student/add-edit-student-attendance-dialog/add-edit-student-attendance-dialog.component';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {
  attendance: Attendance[] = [];
  filteredList: Attendance[] = [];
  searchTerm = '';
  sortColumn: keyof Attendance | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private attendanceService: AttendanceService,
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
        if (this.router.url.includes('/dashboard/attendance')) {
          this.load();
        }
      });
  }

  load(): void {
    console.log("Load call");
    this.attendanceService.getAllStudentAttendance().subscribe({
      next: res => {
        this.attendance = res;
        this.filteredList = [...this.attendance];
      },
      error: err => console.error('Failed to load users', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredList = this.attendance.filter(
      u => u.studentId?.toString().toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Attendance | '', keepDirection = false): void {
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
    const dialogRef = this.dialog.open(AddEditStudentAttendanceDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.attendance.push(result);
        this.filteredList = [...this.attendance];
      }
    });
  }

  onEdit(pAttendance: Attendance, index: number) {
    const dialogRef = this.dialog.open(AddEditStudentAttendanceDialogComponent, {
      width: '400px',
      data: pAttendance
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.attendance[index] = result;
        this.filteredList = [...this.attendance];
      }
    });
  }
  onDelete(pAttendance: Attendance, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pAttendance
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.attendanceService.deleteStudentAttendance(pAttendance).subscribe({
            next: res => {
              console.log('Attendance Deleted:', res);
              this.attendance.splice(index,1);
              this.filteredList = [...this.attendance];
            },
            error: err => console.error('Failed to delete Attendance', err)
          });
      }
    });
  }


}
