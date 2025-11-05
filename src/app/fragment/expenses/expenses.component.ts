import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { Expenses } from '../../models/expenses/expenses.model';
import { Institute } from '../../models/institute/institute.model';
import { ExpensesService } from '../../services/expenses/expenses.service';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GlobalService } from '../../services/global/global.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-expenses',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent implements OnInit {
  expensesList: Expenses[] = [];
  filteredlist: Expenses[] = [];
  expense: Expenses = new Expenses();
  institute: Institute = new Institute();
  searchTerm = '';
  sortColumn: keyof Expenses | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private expensesService: ExpensesService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private globalService: GlobalService
  ) {
    this.institute = this.globalService.getInstitute();
  }

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
        if (this.router.url.includes('/dashboard/expenses')) {
          this.load();
        }
      });
  }

  load(): void {
    this.expensesService.getAll().subscribe({
      next: res => {
        this.expensesList = res;
        this.filteredlist = [...this.expensesList];
      },
      error: err => console.error('Failed to load expenses', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredlist = this.expensesList.filter(
      u => u.campusId?.toString().toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Expenses | '', keepDirection = false): void {
    if (!column) return;
    if (!keepDirection) {
      this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortColumn = column;

    this.filteredlist.sort((a, b) => {
      const valA = (a[column] || '').toString().toLowerCase();
      const valB = (b[column] || '').toString().toLowerCase();
      return valA < valB ? (this.sortDirection === 'asc' ? -1 : 1) : valA > valB ? (this.sortDirection === 'asc' ? 1 : -1) : 0;
    });
  }
  onAdd() {
    // const dialogRef = this.dialog.open(AddEditStudentFeeDialogComponent, {
    //   width: '400px',
    //   data: null
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.feelist.push(result);
    //     this.filteredlist = [...this.feelist];
    //   }
    // });
  }

  onEdit(pExpenses: Expenses, index: number) {
    // const dialogRef = this.dialog.open(AddEditStudentFeeDialogComponent, {
    //   width: '400px',
    //   data: pExpenses
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.expensesList[index] = result;
    //     this.filteredlist = [...this.expensesList];
    //   }
    // });
  }
  onDelete(pExpenses: Expenses, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pExpenses
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expensesService.delete(pExpenses).subscribe({
          next: res => {
            console.log('Expense Deleted:', res);
            this.expensesList.splice(index, 1);
            this.filteredlist = [...this.expensesList];
          },
            error: err => console.error('Failed to delete Fee', err)
          });
      }
    });
  }

}
