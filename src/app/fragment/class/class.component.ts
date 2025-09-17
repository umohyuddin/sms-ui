import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Sclass } from '../../models/course/sclass.model';
import { SclassService } from '../../services/course/sclass.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEditClassDialogComponent } from '../../dialog/course/add-edit-class-dialog/add-edit-class-dialog.component';
@Component({
  selector: 'app-class',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './class.component.html',
  styleUrl: './class.component.scss'
})
export class ClassComponent {

  classList: Sclass[] = [];
  filteredList: Sclass[] = [];
  searchTerm = '';
  sortColumn: keyof Sclass | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private sclassService: SclassService,
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
        if (this.router.url.includes('/dashboard/class')) {
          this.load();
        }
      });
  }

  load(): void {

    this.sclassService.getAllClasses().subscribe({
      next: res => {
        this.classList = res;
        this.filteredList = [...this.classList];
      },
      error: err => console.error('Failed to load Sclass', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredList = this.classList.filter(
      u => u.classId?.toString().toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Sclass | '', keepDirection = false): void {
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
    const dialogRef = this.dialog.open(AddEditClassDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.classList.push(result);
        this.filteredList = [...this.classList];
      }
    });
  }

  onEdit(pSclass: Sclass, index: number) {
    const dialogRef = this.dialog.open(AddEditClassDialogComponent, {
      width: '400px',
      data: pSclass
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.classList[index] = result;
        this.filteredList = [...this.classList];
      }
    });
  }
  onDelete(pSclass: Sclass, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pSclass
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sclassService.deleteClass(pSclass).subscribe({
            next: res => {
              console.log('Sclass Deleted:', res);
              this.classList.splice(index,1);
              this.filteredList = [...this.classList];
            },
            error: err => console.error('Failed to delete Sclass', err)
          });
      }
    });
  }

}
