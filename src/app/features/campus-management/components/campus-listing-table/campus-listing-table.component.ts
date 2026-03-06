import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { CampusManagementService } from '../../services/campus-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { CampusResponse } from '../../models/campusResponse';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';

@Component({
  selector: 'app-campus-listing-table',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoaderComponent,
    ToasterComponent,
    DeletePopupComponent
  ],
  templateUrl: './campus-listing-table.component.html',
  styleUrls: ['./campus-listing-table.component.css']
})
export class CampusListingTableComponent implements OnInit, OnDestroy {
  texts = PageTexts.campus;
  pagination: Pagination<CampusResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  campuses: CampusResponse[] = [];
  isLoading = false;
  loadingMessage = '';
  showDeletePopup = false;
  campusToDeleteId: any = null;

  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private campusManagementService: CampusManagementService,
    private logger: LoggerService
  ) { }

  columns = [
    // { key: 'id', label: 'Id', sortable: true },
    { key: 'campusName', label: 'Campus Name', sortable: true },
    { key: 'campusCode', label: 'Campus Code', sortable: true },
    { key: 'contactNumber', label: 'Contact Number', sortable: true },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'website', label: 'Web Site', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.getCampuses();
    this.SubscribeToSearch();
  }

  private SubscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => {
          this.isLoading = true;
          this.loadingMessage = 'Searching Campuses...';
          return this.campusManagementService.searchCampuses(search || '');
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.campuses = response.body;
          this.pagination = new Pagination(this.campuses, 10);
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

  private getCampuses() {
    this.isLoading = true;
    this.loadingMessage = 'Loading Campuses...';
    this.campusManagementService.getAllCampuses().subscribe({
      next: (response) => {
        this.campuses = response.body || [];
        this.pagination = new Pagination(this.campuses, 10);
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.error('❌ Request Error Status:', error.status);
        this.toaster?.show('Failed to load campuses.', 'error');
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
      }
    })
  }

  viewCampusDetails(campus: CampusResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.CAMPUS.DETAILS(campus.id.toString()));
  }

  editCampusDetails(campus: CampusResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.CAMPUS.EDIT(campus.id.toString()));
  }

  deleteCampus(campusId: any, event: Event): void {
    event.stopPropagation();
    this.campusToDeleteId = campusId;
    this.showDeletePopup = true;
  }

  onConfirmDelete(): void {
    if (!this.campusToDeleteId) return;

    this.showDeletePopup = false;
    this.isLoading = true;
    this.loadingMessage = 'Deleting Campus...';

    this.campusManagementService.deleteCampus(this.campusToDeleteId).subscribe({
      next: (response: any) => {
        this.getCampuses();
        const message = response?.body?.message || 'Campus deleted successfully';
        this.toaster?.show(message, 'success');
        this.campusToDeleteId = null;
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.error('❌ Delete Error Status:', error.status);
        this.toaster?.show('Failed to delete campus.', 'error');
        this.campusToDeleteId = null;
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
      }
    });
  }

  onCancelDelete(): void {
    this.showDeletePopup = false;
    this.campusToDeleteId = null;
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
