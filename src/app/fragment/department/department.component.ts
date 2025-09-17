import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Department } from '../../models/institute/department.model'
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DepartmentService } from '../../services/institute/department.service';
import { AddEditDepartmentDialogComponent } from '../../dialog/institute/department/add-edit-department-dialog/add-edit-department-dialog.component'
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent {

  department: Department[] = [];
  filteredDepartments: Department[] = [];
  searchTerm = '';
  sortColumn: keyof Department | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private departmentService: DepartmentService,
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
        if (this.router.url.includes('/dashboard/department')) {
          this.load();
        }
      });
  }

  load(): void {
    console.log("Load call");
    this.departmentService.getAllDeparments().subscribe({
      next: res => {
        this.department = res;
        this.filteredDepartments = [...this.department];
      },
      error: err => console.error('Failed to load users', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDepartments = this.department.filter(
      u => u.departmentName?.toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Department | '', keepDirection = false): void {
    if (!column) return;
    if (!keepDirection) {
      this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortColumn = column;

    this.filteredDepartments.sort((a, b) => {
      const valA = (a[column] || '').toString().toLowerCase();
      const valB = (b[column] || '').toString().toLowerCase();
      return valA < valB ? (this.sortDirection === 'asc' ? -1 : 1) : valA > valB ? (this.sortDirection === 'asc' ? 1 : -1) : 0;
    });
  }

  onAdd() {
      const dialogRef = this.dialog.open(AddEditDepartmentDialogComponent, {
        width: '400px',
        data: null
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.department.push(result);
          this.filteredDepartments = [...this.department];
        }
      });
    }
  
    onEdit(pDepartment: Department, index: number) {
      const dialogRef = this.dialog.open(AddEditDepartmentDialogComponent, {
        width: '400px',
        data: pDepartment
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.department[index] = result;
          this.filteredDepartments = [...this.department];
        }
      });
    }
    onDelete(pDepartment: Department, index: number) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: pDepartment
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.departmentService.deleteDeparment(pDepartment).subscribe({
              next: res => console.log('Department Deleted:', res),
              error: err => console.error('Failed to delete Department', err)
            });
          this.department.splice(index,1);
          this.filteredDepartments = [...this.department];
        }
      });
    }
}
