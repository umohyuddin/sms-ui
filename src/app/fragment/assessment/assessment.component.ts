import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Assessment } from '../../models/course/assessment.modelinterface';
import { AssessmentService } from '../../services/course/assessment.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEditAssessmentDialogComponent } from '../../dialog/course/add-edit-assessment-dialog/add-edit-assessment-dialog.component';
@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss'
})
export class AssessmentComponent {
  assessmentList: Assessment[] = [];
  filteredList: Assessment[] = [];
  searchTerm = '';
  sortColumn: keyof Assessment | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private assessmentService: AssessmentService,
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
        if (this.router.url.includes('/home/assessment')) {
          this.load();
        }
      });
  }

  load(): void {
    this.assessmentService.getAllAssessment().subscribe({
      next: res => {
        this.assessmentList = res;
        this.filteredList = [...this.assessmentList];
      },
      error: err => console.error('Failed to load Assessment', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredList = this.assessmentList.filter(
      u => u.name?.toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Assessment | '', keepDirection = false): void {
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
    const dialogRef = this.dialog.open(AddEditAssessmentDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assessmentList.push(result);
        this.filteredList = [...this.assessmentList];
      }
    });
  }

  onEdit(pAssessment: Assessment, index: number) {
    const dialogRef = this.dialog.open(AddEditAssessmentDialogComponent, {
      width: '400px',
      data: pAssessment
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assessmentList[index] = result;
        this.filteredList = [...this.assessmentList];
      }
    });
  }
  onDelete(pAssessment: Assessment, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pAssessment
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assessmentService.deleteAssessment(pAssessment).subscribe({
            next: res => {
              console.log('Assessment Deleted:', res);
              this.assessmentList.splice(index,1);
              this.filteredList = [...this.assessmentList];
            },
            error: err => console.error('Failed to delete Assessment', err)
          });
      }
    });
  }
}
