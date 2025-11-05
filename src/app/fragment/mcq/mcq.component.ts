import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { Institute } from '../../models/institute/institute.model';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GlobalService } from '../../services/global/global.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { Mcq } from '../../models/question/mcq.model';
import { McqService } from '../../services/question/mcq.service';

@Component({
  selector: 'app-mcq',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './mcq.component.html',
  styleUrl: './mcq.component.scss'
})
export class McqComponent implements OnInit {
  mcqList: Mcq[] = [];
  filteredlist: Mcq[] = [];
  mcq: Mcq = new Mcq();
  institute: Institute = new Institute();
  searchTerm = '';
  sortColumn: keyof Mcq | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private mcqService: McqService,
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
        if (this.router.url.includes('/dashboard/mcq')) {
          this.load();
        }
      });
  }

  load(): void {
    this.mcqService.getAll().subscribe({
      next: res => {
        this.mcqList = res;
        this.filteredlist = [...this.mcqList];
      },
      error: err => console.error('Failed to load mcqs', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredlist = this.mcqList.filter(
      u => u.subjectId?.toString().toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Mcq | '', keepDirection = false): void {
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

  onEdit(pMcq: Mcq, index: number) {
    // const dialogRef = this.dialog.open(AddEditStudentFeeDialogComponent, {
    //   width: '400px',
    //   data: pMcq 
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.mcqList[index] = result;
    //     this.filteredlist = [...this.mcqList];
    //   }
    // });
  }
  onDelete(pMcq: Mcq, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pMcq
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mcqService.delete(pMcq).subscribe({
          next: res => {
            console.log('MCQ Deleted:', res);
            this.mcqList.splice(index, 1);
            this.filteredlist = [...this.mcqList];
          },
            error: err => console.error('Failed to delete MCQ', err)
          });
      }
    });
  }

}
