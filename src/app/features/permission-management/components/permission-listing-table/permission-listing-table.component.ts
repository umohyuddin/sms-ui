import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { PermissionService } from '../../services/permission.service';
import { PermissionResponse } from '../../models/PermissionResponse';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-permission-listing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './permission-listing-table.component.html',
  styleUrl: './permission-listing-table.component.css'
})
export class PermissionListingTableComponent {
  texts = PageTexts.permissions;
  pagination: Pagination<PermissionResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  permissions: PermissionResponse[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private permissionService: PermissionService
  ) {}

  columns = [
    { key: 'permissionName', label: 'Permission Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'module', label: 'Module', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.getPermissions();
    this.subscribeToSearch();
  }

  private subscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.permissionService.searchPermissions(search || '')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.permissions = response.body || [];
          this.pagination = new Pagination(this.permissions, 10);
        },
        error: (error) => {
          console.error('Search error:', error);
        }
      });
  }

  private getPermissions() {
    this.permissionService.getAllPermissions().subscribe({
      next: (response) => {
        this.permissions = response.body || [];
        this.pagination = new Pagination(this.permissions, 10);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      }
    });
  }

  viewPermissionDetails(permission: PermissionResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.PERMISSIONS.DETAILS(permission.id.toString()));
  }

  editPermissionDetails(permission: PermissionResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.PERMISSIONS.EDIT(permission.id.toString()));
  }

  deletePermission(permissionId: number, event: Event): void {
    event.stopPropagation();

    if (confirm(this.texts.messages.deleteConfirmation)) {
      this.permissionService.deletePermission(permissionId).subscribe({
        next: () => {
          this.permissions = this.permissions.filter(p => p.id !== permissionId);
          this.pagination = new Pagination(this.permissions, 10);
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
