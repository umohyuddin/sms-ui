import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EmployeeRole } from '../../models/employee/employee-role.model';
import { EmployeeRoleService } from '../../services/employee/employee-role.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { AddEditEmployeeRoleDialogComponent } from '../../dialog/employee/add-edit-employee-role-dialog/add-edit-employee-role-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-emploee-role',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './employee-role.component.html',
  styleUrl: './employee-role.component.scss'
})
export class EmploeeRoleComponent {
  employeeRoles: EmployeeRole[] = [];
  filteredEmployeeRole: EmployeeRole[] = [];
  searchTerm = '';
  sortColumn: keyof EmployeeRole | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private employeeRoleService: EmployeeRoleService,
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
        if (this.router.url.includes('/dashboard/employeeRole')) {
          this.load();
        }
      });
  }

  load(): void {
    this.employeeRoleService.getAllEmployeeRole().subscribe({
      next: res => {
        this.employeeRoles = res;
        this.filteredEmployeeRole = [...this.employeeRoles];
      },
      error: err => console.error('Failed to load EmployeeRole', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployeeRole = this.employeeRoles.filter(
      u => u.name?.toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof EmployeeRole | '', keepDirection = false): void {
    if (!column) return;
    if (!keepDirection) {
      this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortColumn = column;

    this.filteredEmployeeRole.sort((a, b) => {
      const valA = (a[column] || '').toString().toLowerCase();
      const valB = (b[column] || '').toString().toLowerCase();
      return valA < valB ? (this.sortDirection === 'asc' ? -1 : 1) : valA > valB ? (this.sortDirection === 'asc' ? 1 : -1) : 0;
    });
  }
  onAdd() {
    const dialogRef = this.dialog.open(AddEditEmployeeRoleDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeRoles.push(result);
        this.filteredEmployeeRole = [...this.employeeRoles];
      }
    });
  }

  onEdit(pEmployeeRole: EmployeeRole, index: number) {
    const dialogRef = this.dialog.open(AddEditEmployeeRoleDialogComponent, {
      width: '400px',
      data: pEmployeeRole
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeRoles[index] = result;
        this.filteredEmployeeRole = [...this.employeeRoles];
      }
    });
  }
  onDelete(pEmployeeRole: EmployeeRole, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pEmployeeRole
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeRoleService.deleteEmployeeRole(pEmployeeRole).subscribe({
            next: res => console.log('EmployeeRole Deleted:', res),
            error: err => console.error('Failed to delete EmployeeRole', err)
          });
        this.employeeRoles.splice(index,1);
        this.filteredEmployeeRole = [...this.employeeRoles];
      }
    });
  }
}
