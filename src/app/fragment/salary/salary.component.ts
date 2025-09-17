import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Salary } from '../../models/employee/salary.model';
import { SalaryService } from '../../services/employee/salary.service';
import { AddEditSalaryDialogComponent } from '../../dialog/employee/add-edit-salary-dialog/add-edit-salary-dialog.component';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './salary.component.html',
  styleUrl: './salary.component.scss'
})
export class SalaryComponent {
  salaries: Salary[] = [];
  filteredSalary: Salary[] = [];
  searchTerm = '';
  sortColumn: keyof Salary | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private salaryService: SalaryService,
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
        if (this.router.url.includes('/dashboard/salary')) {
          this.load();
        }
      });
  }

  load(): void {
    console.log("Load call");
    this.salaryService.getAllSalary().subscribe({
      next: res => {
        this.salaries = res;
        this.filteredSalary = [...this.salaries];
      },
      error: err => console.error('Failed to load users', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredSalary = this.salaries.filter(
      u => u.empId?.toString().toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Salary | '', keepDirection = false): void {
    if (!column) return;
    if (!keepDirection) {
      this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortColumn = column;

    this.filteredSalary.sort((a, b) => {
      const valA = (a[column] || '').toString().toLowerCase();
      const valB = (b[column] || '').toString().toLowerCase();
      return valA < valB ? (this.sortDirection === 'asc' ? -1 : 1) : valA > valB ? (this.sortDirection === 'asc' ? 1 : -1) : 0;
    });
  }
  onAdd() {
    const dialogRef = this.dialog.open(AddEditSalaryDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salaries.push(result);
        this.filteredSalary = [...this.salaries];
      }
    });
  }

  onEdit(pSalary: Salary, index: number) {
    const dialogRef = this.dialog.open(AddEditSalaryDialogComponent, {
      width: '400px',
      data: pSalary
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salaries[index] = result;
        this.filteredSalary = [...this.salaries];
      }
    });
  }
  onDelete(pSalary: Salary, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pSalary
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salaryService.deleteSalary(pSalary).subscribe({
            next: res => {
              console.log('Salary Deleted:', res);
              this.salaries.splice(index,1);
              this.filteredSalary = [...this.salaries];
            },
            error: err => console.error('Failed to delete Salary', err)
          });
      }
    });
  }

}
