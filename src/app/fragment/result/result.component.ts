import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { Result } from '../../models/class/result.model';
import { Institute } from '../../models/institute/institute.model';
import { ResultService } from '../../services/result/result.service';
import { AuthService } from '../../services/auth/auth.service';
import { GlobalService } from '../../services/global/global.service';

@Component({
  selector: 'app-result',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent implements OnInit {
  resultList: Result[] = [];
  filteredlist: Result[] = [];
  result: Result = new Result();
  institute: Institute = new Institute();
  searchTerm = '';
  sortColumn: keyof Result | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private resultService: ResultService,
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
        if (this.router.url.includes('/dashboard/result')) {
          this.load();
        }
      });
  }

  load(): void {
    this.resultService.getAll().subscribe({
      next: res => {
        this.resultList = res;
        this.filteredlist = [...this.resultList];
      },
      error: err => console.error('Failed to load results', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredlist = this.resultList.filter(
      u => u.studentId?.toString().toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Result  | '', keepDirection = false): void {
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

  onEdit(pResult: Result, index: number) {
    // const dialogRef = this.dialog.open(AddEditStudentFeeDialogComponent, {
    //   width: '400px',
    //   data: pResult
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.resultList[index] = result;
    //     this.filteredlist = [...this.resultList];
    //   }
    // });
  }
  onDelete(pResult: Result, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pResult
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resultService.delete(pResult).subscribe({
          next: res => {
            console.log('Result Deleted:', res);
            this.resultList.splice(index, 1);
            this.filteredlist = [...this.resultList];
          },
            error: err => console.error('Failed to delete Result', err)
          });
      }
    });
  }


}
