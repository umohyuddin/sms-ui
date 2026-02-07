import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { RolesService } from '../../services/roles.service';
import { RoleResponse } from '../../models/RoleResponse';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { JwtService } from '../../../../core/services/jwt.service';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';


@Component({
  selector: 'app-roles-listing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DeletePopupComponent, ToasterComponent, LoaderComponent],
  templateUrl: './roles-listing-table.component.html',
  styleUrl: './roles-listing-table.component.css'
})
export class RolesListingTableComponent {
  @ViewChild('toaster') toaster!: ToasterComponent;
  loading: boolean = false;
  texts = PageTexts.roles;
  pagination: Pagination<RoleResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  roles: RoleResponse[] = [];
  isDeletePopupOpen = false;
  pendingDeleteId?: number;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private rolesService: RolesService,
    private jwtService: JwtService
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
        switchMap(search => {
          this.loading = true;
          return this.rolesService.searchRoles(search || '');
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.roles = response.body || [];
          this.pagination = new Pagination(this.roles, 10);
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.toaster?.show('Failed to search roles.', 'error');
          console.error('Search error:', error);
        }
      });
  }

  private getRoles() {
    this.loading = true;
    this.rolesService.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response.body || [];
        this.pagination = new Pagination(this.roles, 10);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toaster?.show('Failed to load roles.', 'error');
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
    this.pendingDeleteId = roleId;
    this.isDeletePopupOpen = true;
  }

  onConfirmDelete(): void {
    if (this.pendingDeleteId !== undefined) {
      this.loading = true;
      this.rolesService.deleteRole(this.pendingDeleteId).subscribe({
        next: () => {
          this.roles = this.roles.filter(r => r.id !== this.pendingDeleteId);
          this.pagination = new Pagination(this.roles, 10);
          this.isDeletePopupOpen = false;
          this.pendingDeleteId = undefined;
          this.loading = false;
          this.toaster?.show('Role deleted successfully.', 'success');
        },
        error: (error) => {
          this.loading = false;
          this.toaster?.show('Failed to delete role.', 'error');
          console.error('❌ Delete Error Status:', error.status);
          console.error('Message:', error.message);
          this.isDeletePopupOpen = false;
          this.pendingDeleteId = undefined;
        }
      });
    }
  }

  onCancelDelete(): void {
    this.isDeletePopupOpen = false;
    this.pendingDeleteId = undefined;
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
