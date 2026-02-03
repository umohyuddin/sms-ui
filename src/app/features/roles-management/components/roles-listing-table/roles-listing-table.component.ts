import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { RolesService } from '../../services/roles.service';
import { RoleResponse } from '../../models/RoleResponse';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-roles-listing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './roles-listing-table.component.html',
  styleUrl: './roles-listing-table.component.css'
})
export class RolesListingTableComponent {
  texts = PageTexts.roles;
  pagination: Pagination<RoleResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  roles: RoleResponse[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private rolesService: RolesService
  ) {}

  columns = [
    { key: 'roleName', label: 'Role Name', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.getRoles();
    this.subscribeToSearch();
  }

  private subscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.rolesService.searchRoles(search || '')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.roles = response.body || [];
          this.pagination = new Pagination(this.roles, 10);
        },
        error: (error) => {
          console.error('Search error:', error);
        }
      });
  }

  private getRoles() {
    this.rolesService.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response.body || [];
        this.pagination = new Pagination(this.roles, 10);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      }
    });
  }

  viewRoleDetails(role: RoleResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.ROLES.DETAILS(role.id.toString()));
  }

  editRoleDetails(role: RoleResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.ROLES.EDIT(role.id.toString()));
  }

  deleteRole(roleId: number, event: Event): void {
    event.stopPropagation();

    if (confirm(this.texts.messages.deleteConfirmation)) {
      this.rolesService.deleteRole(roleId).subscribe({
        next: () => {
          this.roles = this.roles.filter(r => r.id !== roleId);
          this.pagination = new Pagination(this.roles, 10);
        },
        error: (error) => {
          console.error('❌ Delete Error Status:', error.status);
          console.error('Message:', error.message);
        }
      });
    }
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
