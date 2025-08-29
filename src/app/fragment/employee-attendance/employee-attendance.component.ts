import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EmployeeAttendance } from '../../models/employee/employee-attendance.modelinterface';
import { EmployeeAttendanceService } from '../../services/employee/employee-attendance.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { AddEditEmployeeAttendanceDialogComponent } from '../../dialog/employee/add-edit-employee-attendance-dialog/add-edit-employee-attendance-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-emploee-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './employee-attendance.component.html',
  styleUrl: './employee-attendance.component.scss'
})
export class EmploeeAttendanceComponent {

  employeeAttendance: EmployeeAttendance[] = [];
  filteredList: EmployeeAttendance[] = [];
  searchTerm = '';
  sortColumn: keyof EmployeeAttendance | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private employeeAttendanceService: EmployeeAttendanceService,
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
        if (this.router.url.includes('/home/userRole')) {
          this.load();
        }
      });
  }

  load(): void {
    this.employeeAttendanceService.getAllEmployeeAttendance().subscribe({
      next: res => {
        this.employeeAttendance = res;
        this.filteredList = [...this.employeeAttendance];
      },
      error: err => console.error('Failed to load EmployeeAttendance', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredList = this.employeeAttendance.filter(
      u => u.empId?.toString().toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof EmployeeAttendance | '', keepDirection = false): void {
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
    const dialogRef = this.dialog.open(AddEditEmployeeAttendanceDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeAttendance.push(result);
        this.filteredList = [...this.employeeAttendance];
      }
    });
  }

  onEdit(pEmployeeAttendance: EmployeeAttendance, index: number) {
    const dialogRef = this.dialog.open(AddEditEmployeeAttendanceDialogComponent, {
      width: '400px',
      data: pEmployeeAttendance
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeAttendance[index] = result;
        this.filteredList = [...this.employeeAttendance];
      }
    });
  }
  onDelete(pEmployeeAttendance: EmployeeAttendance, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pEmployeeAttendance
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeAttendanceService.deleteEmployeeAttendance(pEmployeeAttendance).subscribe({
            next: res => console.log('EmployeeAttendance Deleted:', res),
            error: err => console.error('Failed to delete EmployeeAttendance', err)
          });
        this.employeeAttendance.splice(index,1);
        this.filteredList = [...this.employeeAttendance];
      }
    });
  }
}
