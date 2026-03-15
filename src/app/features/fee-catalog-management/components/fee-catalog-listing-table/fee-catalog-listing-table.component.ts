import { Component, ViewChild, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../../../core/services/logger.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { FeeCatalogResponse } from '../../models/FeeCatalogResponse';
import { FeeCatalogManagementService } from '../../services/fee-catalog-management.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CHARGE_TYPE_CLASSES, RECURRENCE_RULE_CLASSES } from '../../../../core/const/COLOR_CONST';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
  selector: 'app-fee-catalog-listing-table',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoaderComponent,
    ToasterComponent
  ],
  templateUrl: './fee-catalog-listing-table.component.html',
  styleUrls: ['./fee-catalog-listing-table.component.css']
})
export class FeeCatalogListingTableComponent {
  pagination: Pagination<FeeCatalogResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  feeCatalogResponse: FeeCatalogResponse[] = [];
  RECURRENCE_RULE_CLASSES = RECURRENCE_RULE_CLASSES;
  CHARGE_TYPE_CLASSES = CHARGE_TYPE_CLASSES;
  isLoading = false;
  loadingMessage = '';
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  @Output() editRequested = new EventEmitter<any>();
  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private feeCatalogManagementService: FeeCatalogManagementService,
    private logger: LoggerService) { }

  columns = [
    { key: 'name', label: 'Fee Catalog Name', sortable: true },
    { key: 'code', label: 'Fee Catalog Code', sortable: true },
    { key: 'chargeType', label: 'Charge Type', sortable: true },
    { key: 'recurrenceRule', label: 'Recurrence Rule', sortable: false },
    { key: 'active', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    this.getFeeCatalogs();
    this.SubscribeToSearch();
  }

  private SubscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => {
          this.isLoading = true;
          this.loadingMessage = 'Searching Fee Catalogs...';
          return this.feeCatalogManagementService.searchFeeCatalogs(search || '');
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.feeCatalogResponse = response.body;
          this.pagination = new Pagination(this.feeCatalogResponse, 10);
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

  getFeeCatalogs() {
    this.isLoading = true;
    this.loadingMessage = 'Loading Fee Catalogs...';
    this.feeCatalogManagementService.getAllFeeCatalogs().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.feeCatalogResponse = response.body;
        this.pagination = new Pagination(this.feeCatalogResponse, 10);
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to load Fee Catalogs.', 'error');
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.log('🔚 Request Complete');
      }
    })
  }

  viewDetails(item: FeeCatalogResponse, event: Event): void {
    console.log('Viewing details for Resoruce ID:', item.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.FEE.FEE_CATALOG.DETAILS(item.id.toString()));
  }

  editDetails(item: FeeCatalogResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    event.stopPropagation();
    console.log('Editing Resource ID:', item.id);
    this.editRequested.emit(item);
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
