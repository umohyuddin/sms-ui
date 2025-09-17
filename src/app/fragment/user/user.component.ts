import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService} from '../../services/user/user.service';
import { User } from '../../models/user/user.model'
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { AddEditUserDialogComponent } from '../../dialog/user/add-edit-user-dialog/add-edit-user-dialog.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  sortColumn: keyof User | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private userService: UserService,
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
        if (this.router.url.includes('/dashboard')) {
          this.load();
        }
      });
  }

  load(): void {
    console.log("Load call");
    this.userService.getUsers().subscribe({
      next: res => {
        console.log("inside next");
        this.users = res;
        this.filteredUsers = [...this.users];
      },
      error: err => console.error('Failed to load users', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      u => u.username?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof User | '', keepDirection = false): void {
    if (!column) return;
    if (!keepDirection) {
      this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortColumn = column;

    this.filteredUsers.sort((a, b) => {
      const valA = (a[column] || '').toString().toLowerCase();
      const valB = (b[column] || '').toString().toLowerCase();
      return valA < valB ? (this.sortDirection === 'asc' ? -1 : 1) : valA > valB ? (this.sortDirection === 'asc' ? 1 : -1) : 0;
    });
  }

  onAdd() {
    const dialogRef = this.dialog.open(AddEditUserDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users.push(result);
      }
    });
  }

  onEdit(user: User, index: number) {
    const dialogRef = this.dialog.open(AddEditUserDialogComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users[index] = result;
      }
    });
  }

  onDelete(pUser: User, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pUser
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(pUser).subscribe({
            next: res => {
              console.log('User Deleted:', res);
              this.users.splice(index,1);
              this.filteredUsers = [...this.users];
            },
            error: err => console.error('Failed to delete User', err)
          });
      }
    });
  }
}
