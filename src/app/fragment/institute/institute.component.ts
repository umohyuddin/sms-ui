import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstituteService} from '../../services/institute/institute.service';
import { Institute } from '../../models/institute/institute.model';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AddEditInstituteDialogComponent } from '../../dialog/institute/institute/add-edit-institute-dialog/add-edit-institute-dialog.component'
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-institute',
 standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './institute.component.html',
  styleUrl: './institute.component.scss'
})
export class InstituteComponent {

    institute: Institute[] = [];

  filteredInstitute: Institute[] = [];
  searchTerm = '';
  sortColumn: keyof Institute | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private instituteService: InstituteService,
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
        if (this.router.url.includes('/dashboard/institute')) {
          this.load();
        }
      });
  }

  load(): void {
    this.instituteService.getAllInstitute().subscribe({
      next: res => {
        this.institute = res;
        this.filteredInstitute = [...this.institute];
      },
      error: err => console.error('Failed to load users', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredInstitute = this.institute.filter(
      u => u.name?.toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Institute | '', keepDirection = false): void {
    if (!column) return;
    if (!keepDirection) {
      this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortColumn = column;

    this.filteredInstitute.sort((a, b) => {
      const valA = (a[column] || '').toString().toLowerCase();
      const valB = (b[column] || '').toString().toLowerCase();
      return valA < valB ? (this.sortDirection === 'asc' ? -1 : 1) : valA > valB ? (this.sortDirection === 'asc' ? 1 : -1) : 0;
    });
  }

  onAdd() {
        const dialogRef = this.dialog.open(AddEditInstituteDialogComponent, {
          width: '400px',
          data: null
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.institute.push(result);
            this.filteredInstitute = [...this.institute];
          }
        });
      }
    
      onEdit(pInstitute: Institute, index: number) {
        const dialogRef = this.dialog.open(AddEditInstituteDialogComponent, {
          width: '400px',
          data: pInstitute
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.institute[index] = result;
            this.filteredInstitute = [...this.institute];
          }
        });
      }
      onDelete(pInstitute: Institute, index: number) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '400px',
          data: pInstitute
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.instituteService.deleteIstitute(pInstitute).subscribe({
                next: res => console.log('Role Deleted:', res),
                error: err => console.error('Failed to delete campus', err)
              });
            this.institute.splice(index,1);
            this.filteredInstitute = [...this.institute];
          }
        });
      }

}
