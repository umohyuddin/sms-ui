import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { AdmissionTypeManagementService } from '../../services/admission-type-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { AdmissionTypeResponseDTO } from '../../models/AdmissionTypeResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';

@Component({
  selector: 'app-admission-type-listing-table',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoaderComponent,
    ToasterComponent,
    DeletePopupComponent
  ],
  templateUrl: './admission-type-listing-table.component.html',
  styleUrls: ['./admission-type-listing-table.component.css']
})
export class AdmissionTypeListingTableComponent implements OnInit, OnDestroy {
  pagination: Pagination<AdmissionTypeResponseDTO> = new Pagination([], 10);
  searchControl = new FormControl('');
  admissionTypes: AdmissionTypeResponseDTO[] = [];
  isLoading = false;
  loadingMessage = '';
  showDeletePopup = false;
  itemToDeleteId: any = null;

  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private admissionTypeService: AdmissionTypeManagementService,
    private logger: LoggerService
  ) { }

  columns = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'isActive', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  ngOnInit() {
    this.getItems();
    this.SubscribeToSearch();
  }

  private SubscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => {
          this.isLoading = true;
          this.loadingMessage = 'Searching Admission Types...';
          return this.admissionTypeService.searchAdmissionTypes(search || '');
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.admissionTypes = response.body;
          this.pagination = new Pagination(this.admissionTypes, 10);
          this.isLoading = false;
          this.loadingMessage = '';
        },
        error: (error) => {
          this.isLoading = false;
          this.loadingMessage = '';
          console.error('Search error:', error);
          this.toaster?.show('Search failed.', 'error');
        }
      });
  }

  private getItems() {
    this.isLoading = true;
    this.loadingMessage = 'Loading Admission Types...';
    this.admissionTypeService.getAllAdmissionTypes().subscribe({
      next: (response) => {
        this.admissionTypes = response.body || [];
        this.pagination = new Pagination(this.admissionTypes, 10);
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.error('Request Error:', error);
        this.toaster?.show('Failed to load admission types.', 'error');
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
      }
    });
  }

  viewDetails(item: AdmissionTypeResponseDTO, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.ADMISSION_TYPES.DETAILS(item.id.toString()));
  }

  editDetails(item: AdmissionTypeResponseDTO, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.ADMISSION_TYPES.EDIT(item.id.toString()));
  }

  deleteItem(id: any, event: Event): void {
    event.stopPropagation();
    this.itemToDeleteId = id;
    this.showDeletePopup = true;
  }

  onConfirmDelete(): void {
    if (!this.itemToDeleteId) return;

    this.showDeletePopup = false;
    this.isLoading = true;
    this.loadingMessage = 'Deleting...';

    this.admissionTypeService.deleteAdmissionType(this.itemToDeleteId).subscribe({
      next: (response: any) => {
        this.getItems();
        this.toaster?.show('Admission Type deleted successfully', 'success');
        this.itemToDeleteId = null;
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.error('Delete Error:', error);
        this.toaster?.show('Failed to delete admission type.', 'error');
        this.itemToDeleteId = null;
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
      }
    });
  }

  onCancelDelete(): void {
    this.showDeletePopup = false;
    this.itemToDeleteId = null;
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
