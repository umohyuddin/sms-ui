import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TimeTable } from '../../models/class/time-table.model';
import { TimeTableService } from '../../services/class/time-table.service';
import { AddEditSalaryDialogComponent } from '../../dialog/employee/add-edit-salary-dialog/add-edit-salary-dialog.component';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-time-table',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './time-table.component.html',
  styleUrl: './time-table.component.scss'
})
export class TimeTableComponent {
  
  timeTable: TimeTable[] = [];
  filteredTimeTable: TimeTable[] = [];
  searchTerm = '';
  sortColumn: keyof TimeTable | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private timeTableService: TimeTableService,
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
    this.timeTableService.getAll().subscribe({
      next: res => {
        this.timeTable = res;
        this.filteredTimeTable = [...this.timeTable];
      },
      error: err => console.error('Failed to load Time Table', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTimeTable = this.timeTable.filter(
      u => u.id?.toString().toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof TimeTable | '', keepDirection = false): void {
    if (!column) return;
    if (!keepDirection) {
      this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortColumn = column;

    this.filteredTimeTable.sort((a, b) => {
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
        this.timeTable.push(result);
        this.filteredTimeTable = [...this.timeTable];
      }
    });
  }

  onEdit(pTimeTable: TimeTable, index: number) {
    const dialogRef = this.dialog.open(AddEditSalaryDialogComponent, {
      width: '400px',
      data: pTimeTable
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.timeTable[index] = result;
        this.filteredTimeTable = [...this.timeTable];
      }
    });
  }
  onDelete(pTimeTable: TimeTable, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pTimeTable
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.timeTableService.delete(pTimeTable).subscribe({
            next: res => {
              console.log('Time Table Deleted:', res);
              this.timeTable.splice(index,1);
              this.filteredTimeTable = [...this.timeTable];
            },
            error: err => console.error('Failed to delete Time Table', err)
          });
      }
    });
  }


}
