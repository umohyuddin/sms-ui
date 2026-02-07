import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { PermissionService } from '../../services/permission.service';
import { PermissionResponse } from '../../models/PermissionResponse';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-permission-listing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DeletePopupComponent, ToasterComponent, LoaderComponent],
  templateUrl: './permission-listing-table.component.html',
  styleUrl: './permission-listing-table.component.css'
})
export class PermissionListingTableComponent implements OnInit, OnDestroy {
  @ViewChild('toaster') toaster!: ToasterComponent;
  
  texts = PageTexts.permissions;
  pagination: Pagination<PermissionResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  permissions: PermissionResponse[] = [];
  isDeletePopupOpen = false;
  pendingDeleteId?: number;
  loading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private permissionService: PermissionService
  ) { }

  columns = [
    { key: 'module', label: 'Module', sortable: true },
    { key: 'resource', label: 'Resource', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'name', label: 'Permission Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  ngOnInit() {
    this.getPermissions();
    this.subscribeToSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => {
          this.loading = true;
          return this.permissionService.searchPermissions(search || '');
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          console.log('✅ Search results:', data);
          this.permissions = data || [];
          this.pagination = new Pagination(this.permissions, 10);
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Search error:', error);
          this.loading = false;
          this.toaster?.show('Error searching permissions', 'error');
        }
      });
  }

  private getPermissions() {
    this.loading = true;
    console.log('🔄 Loading permissions...');
    
    this.permissionService.getAllPermissions().subscribe({
      next: (data) => {
        console.log('✅ Permissions loaded:', data);
        this.permissions = data || [];
        this.pagination = new Pagination(this.permissions, 10);
        console.log('📊 Total permissions:', this.permissions.length);
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading permissions:', error);
        this.toaster?.show('Failed to load permissions', 'error');
        this.loading = false;
      }
    });
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }

  deletePermission(permissionId: number, event: Event): void {
    event?.preventDefault();
    this.pendingDeleteId = permissionId;
    this.isDeletePopupOpen = true;
  }

  onCancelDelete(): void {
    this.isDeletePopupOpen = false;
    this.pendingDeleteId = undefined;
  }

  onConfirmDelete(): void {
    if (this.pendingDeleteId !== undefined) {
      this.loading = true;
      this.permissionService.deletePermission(this.pendingDeleteId).subscribe({
        next: () => {
          this.toaster?.show('Permission deleted successfully', 'success');
          this.getPermissions();
          this.isDeletePopupOpen = false;
          this.pendingDeleteId = undefined;
        },
        error: (error) => {
          console.error('❌ Error deleting permission:', error);
          this.toaster?.show('Failed to delete permission', 'error');
          this.loading = false;
          this.isDeletePopupOpen = false;
          this.pendingDeleteId = undefined;
        }
      });
    }
  }

  editPermissionDetails(permission: PermissionResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.PERMISSIONS.EDIT(permission.id.toString()));
  }

  viewPermissionDetails(permission: PermissionResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.PERMISSIONS.DETAILS(permission.id.toString()));
  }
}
