import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Fee } from '../../models/student/fee.modelinterface';
import { FeeService } from '../../services/student/fee.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEditStudentFeeDialogComponent } from '../../dialog/student/add-edit-student-fee-dialog/add-edit-student-fee-dialog.component';
@Component({
  selector: 'app-fee',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './fee.component.html',
  styleUrl: './fee.component.scss'
})
export class FeeComponent {
  feelist: Fee[] = [];
  filteredlist: Fee[] = [];
  searchTerm = '';
  sortColumn: keyof Fee | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private feeService: FeeService,
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
        if (this.router.url.includes('/home/fee')) {
          this.load();
        }
      });
  }

  load(): void {
    this.feeService.getAllStudentFee().subscribe({
      next: res => {
        this.feelist = res;
        this.filteredlist = [...this.feelist];
      },
      error: err => console.error('Failed to load Fee', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredlist = this.feelist.filter(
      u => u.studentId?.toString().toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Fee | '', keepDirection = false): void {
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
    const dialogRef = this.dialog.open(AddEditStudentFeeDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.feelist.push(result);
        this.filteredlist = [...this.feelist];
      }
    });
  }

  onEdit(pFee: Fee, index: number) {
    const dialogRef = this.dialog.open(AddEditStudentFeeDialogComponent, {
      width: '400px',
      data: pFee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.feelist[index] = result;
        this.filteredlist = [...this.feelist];
      }
    });
  }
  onDelete(pFee: Fee, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pFee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.feeService.deleteFee(pFee).subscribe({
            next: res => {
              console.log('Fee Deleted:', res);
              this.feelist.splice(index,1);
              this.filteredlist = [...this.feelist];
            },
            error: err => console.error('Failed to delete Fee', err)
          });
      }
    });
  }

}
