import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRoleService} from '../../services/user/user-role.service';
import { UserRole } from '../../models/user/user-role.model'
import { AddEditUserRoleDialogComponent } from '../../dialog/user/add-edit-user-role-dialog/add-edit-user-role-dialog.component'
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-user-role',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {
  userRoles: UserRole[] = [];
  filteredUserRoles: UserRole[] = [];
  searchTerm = '';
  sortColumn: keyof UserRole | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private userRoleService: UserRoleService,
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
        if (this.router.url.includes('/home/userRole')) {
          this.load();
        }
      });
  }

  load(): void {
    this.userRoleService.getUserRole().subscribe({
      next: res => {
        this.userRoles = res;
        this.filteredUserRoles = [...this.userRoles];
      },
      error: err => console.error('Failed to load user roles', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUserRoles = this.userRoles.filter(
      u => u.roleName?.toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof UserRole | '', keepDirection = false): void {
    if (!column) return;
    if (!keepDirection) {
      this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortColumn = column;

    this.filteredUserRoles.sort((a, b) => {
      const valA = (a[column] || '').toString().toLowerCase();
      const valB = (b[column] || '').toString().toLowerCase();
      return valA < valB ? (this.sortDirection === 'asc' ? -1 : 1) : valA > valB ? (this.sortDirection === 'asc' ? 1 : -1) : 0;
    });
  }

  onAdd() {
      const dialogRef = this.dialog.open(AddEditUserRoleDialogComponent, {
        width: '400px',
        data: null
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.userRoles.push(result);
          this.filteredUserRoles = [...this.userRoles];
        }
      });
    }
  
    onEdit(user: UserRole, index: number) {
      const dialogRef = this.dialog.open(AddEditUserRoleDialogComponent, {
        width: '400px',
        data: user
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.userRoles[index] = result;
          this.filteredUserRoles = [...this.userRoles];
        }
      });
    }
    onDelete(role: UserRole, index: number) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: role
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.userRoleService.deleteUserRole(role).subscribe({
              next: res => console.log('Role Deleted:', res),
              error: err => console.error('Failed to delete user role', err)
            });
          this.userRoles.splice(index,1);
          this.filteredUserRoles = [...this.userRoles];
        }
      });
    }
}
