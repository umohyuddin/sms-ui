import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampusService} from '../../services/institute/campus.service';
import { Campus } from '../../models/institute/campus.modelinterface'
import { AddEditCampusDialogComponent } from '../../dialog/institute/campus/add-edit-campus-dialog/add-edit-campus-dialog.component'
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-campus',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './campus.component.html',
  styleUrl: './campus.component.scss'
})
export class CampusComponent {

  campus: Campus[] = [];
  filteredCampus: Campus[] = [];
  searchTerm = '';
  sortColumn: keyof Campus | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private campusService: CampusService,
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
        if (this.router.url.includes('/home/campus')) {
          this.load();
        }
      });
  }

  load(): void {
    this.campusService.getAllCampus().subscribe({
      next: res => {
        this.campus = res;
        this.filteredCampus = [...this.campus];
      },
      error: err => console.error('Failed to load Campuses', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCampus = this.campus.filter(
      u => u.name?.toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Campus | '', keepDirection = false): void {
    if (!column) return;
    if (!keepDirection) {
      this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortColumn = column;

    this.filteredCampus.sort((a, b) => {
      const valA = (a[column] || '').toString().toLowerCase();
      const valB = (b[column] || '').toString().toLowerCase();
      return valA < valB ? (this.sortDirection === 'asc' ? -1 : 1) : valA > valB ? (this.sortDirection === 'asc' ? 1 : -1) : 0;
    });
  }

  onAdd() {
      const dialogRef = this.dialog.open(AddEditCampusDialogComponent, {
        width: '400px',
        data: null
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.campus.push(result);
          this.filteredCampus = [...this.campus];
        }
      });
    }
  
    onEdit(pCampus: Campus, index: number) {
      const dialogRef = this.dialog.open(AddEditCampusDialogComponent, {
        width: '400px',
        data: pCampus
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.campus[index] = result;
          this.filteredCampus = [...this.campus];
        }
      });
    }
    onDelete(pCampus: Campus, index: number) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: pCampus
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.campusService.deleteCampus(pCampus).subscribe({
              next: res => console.log('Role Deleted:', res),
              error: err => console.error('Failed to delete campus', err)
            });
          this.campus.splice(index,1);
          this.filteredCampus = [...this.campus];
        }
      });
    }

}
