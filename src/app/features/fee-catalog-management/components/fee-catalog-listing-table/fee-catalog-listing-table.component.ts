import { Component } from '@angular/core';
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

@Component({
  selector: 'app-fee-catalog-listing-table',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule
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
  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private feeCatalogManagementService: FeeCatalogManagementService,
   private logger: LoggerService) { }

  columns = [
    { key: 'feeCatalogName', label: 'Fee Catalog Name', sortable: true },
    { key: 'feeCatalogCode', label: 'Fee Catalog Code', sortable: true },
    { key: 'chargeType', label: 'Charge Type', sortable: true },
    { key: 'recurrenceRule', label: 'Recurrence Rule', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
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
        switchMap(search => this.feeCatalogManagementService.searchFeeCatalogs(search || '')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.feeCatalogResponse = response.body;
          this.pagination = new Pagination(this.feeCatalogResponse, 10);
        },
        error: (error) => {
          console.error('Search error:', error);
        }
      });
  }

  getFeeCatalogs() {
    this.feeCatalogManagementService.getAllFeeCatalogs().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.feeCatalogResponse = response.body;
        this.pagination = new Pagination(this.feeCatalogResponse, 10);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
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
    console.log('Editing Resoruce ID:', item.id);
    this.router.navigate(ROUTES.FEE.FEE_CATALOG.EDIT(item.id.toString()));
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
}
