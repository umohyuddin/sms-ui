import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Enrollment } from '../../models/course/enrollment.model';
import { EnrollmentService } from '../../services/course/enrollment.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEditEnrollmentDialogComponent } from '../../dialog/course/add-edit-enrollment-dialog/add-edit-enrollment-dialog.component';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.scss'
})
export class EnrollmentComponent {
  
  enrollmentList: Enrollment[] = [];
  filteredList: Enrollment[] = [];
  searchTerm = '';
  sortColumn: keyof Enrollment | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private enrollmentService: EnrollmentService,
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
        if (this.router.url.includes('/dashboard/enrollment')) {
          this.load();
        }
      });
  }

  load(): void {
    console.log("Load call");
    this.enrollmentService.getAllEnrollement().subscribe({
      next: res => {
        this.enrollmentList = res;
        this.filteredList = [...this.enrollmentList];
      },
      error: err => console.error('Failed to load users', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredList = this.enrollmentList.filter(
      u => u.studentId?.toString().toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Enrollment | '', keepDirection = false): void {
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
    const dialogRef = this.dialog.open(AddEditEnrollmentDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enrollmentList.push(result);
        this.filteredList = [...this.enrollmentList];
      }
    });
  }

  onEdit(pEnrollment: Enrollment, index: number) {
    const dialogRef = this.dialog.open(AddEditEnrollmentDialogComponent, {
      width: '400px',
      data: pEnrollment
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enrollmentList[index] = result;
        this.filteredList = [...this.enrollmentList];
      }
    });
  }
  onDelete(pEnrollment: Enrollment, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pEnrollment
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enrollmentService.deleteEnrollement(pEnrollment).subscribe({
            next: res => {
              console.log('Enrollment Deleted:', res);
              this.enrollmentList.splice(index,1);
              this.filteredList = [...this.enrollmentList];
            },
            error: err => console.error('Failed to delete Enrollment', err)
          });
      }
    });
  }
}
