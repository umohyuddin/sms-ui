import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Employee } from '../../models/employee/employee.model';
import { EmployeeService } from '../../services/employee/employee.service';
import { AddEditEmployeeDialogComponent } from '../../dialog/employee/add-edit-employee-dialog/add-edit-employee-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployee: Employee[] = [];
  searchTerm = '';
  sortColumn: keyof Employee | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private employeeService: EmployeeService,
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
        if (this.router.url.includes('/dashboard/employee')) {
          this.load();
        }
      });
  }

  load(): void {
    this.employeeService.getAllEmployee().subscribe({
      next: res => {
        this.employees = res;
        this.filteredEmployee = [...this.employees];
      },
      error: err => console.error('Failed to load Employee', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployee = this.employees.filter(
      u => u.firstName?.toLowerCase().includes(term) || u.lastName?.toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Employee | '', keepDirection = false): void {
    if (!column) return;
    if (!keepDirection) {
      this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortColumn = column;

    this.filteredEmployee.sort((a, b) => {
      const valA = (a[column] || '').toString().toLowerCase();
      const valB = (b[column] || '').toString().toLowerCase();
      return valA < valB ? (this.sortDirection === 'asc' ? -1 : 1) : valA > valB ? (this.sortDirection === 'asc' ? 1 : -1) : 0;
    });
  }
  onAdd() {
    const dialogRef = this.dialog.open(AddEditEmployeeDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employees.push(result);
        this.filteredEmployee = [...this.employees];
      }
    });
  }

  onEdit(pEmployee: Employee, index: number) {
    const dialogRef = this.dialog.open(AddEditEmployeeDialogComponent, {
      width: '400px',
      data: pEmployee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employees[index] = result;
        this.filteredEmployee = [...this.employees];
      }
    });
  }
  onDelete(pEmployee: Employee, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pEmployee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.deleteEmployee(pEmployee).subscribe({
            next: res => console.log('Employee Deleted:', res),
            error: err => console.error('Failed to delete Employee', err)
          });
        this.employees.splice(index,1);
        this.filteredEmployee = [...this.employees];
      }
    });
  }
}
