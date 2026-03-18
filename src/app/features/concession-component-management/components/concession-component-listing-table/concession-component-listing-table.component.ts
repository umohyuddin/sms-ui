import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Pagination } from '../../../../core/pagar/pagination';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CHARGE_TYPE_CLASSES, RECURRENCE_RULE_CLASSES } from '../../../../core/const/COLOR_CONST';
import { ConcessionComponentResponse } from '../../models/ConcessionComponentResponse';
import { ConcessionResponse } from '../../../concession-management/models/ConcessionResponse';
import { ConcessionComponentManagementService } from '../../services/concession-component-management.service';
import { ConcessionManagementService } from '../../../concession-management/services/concession-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-concession-component-listing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoaderComponent, ToasterComponent],
  templateUrl: './concession-component-listing-table.component.html',
  styleUrls: ['./concession-component-listing-table.component.css']
})
export class ConcessionListingTableComponent implements OnInit, OnDestroy {
  pagination: Pagination<ConcessionComponentResponse> = new Pagination([], 10);
  searchForm!: FormGroup;
  concessionComponentResponse: ConcessionComponentResponse[] = [];
  RECURRENCE_RULE_CLASSES = RECURRENCE_RULE_CLASSES;
  CHARGE_TYPE_CLASSES = CHARGE_TYPE_CLASSES;
  discountTypesDD: ConcessionResponse[] = [];

  isLoading = false;
  loadingMessage = '';
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  private destroy$ = new Subject<void>();
  private readonly MODULE = 'ConcessionSubType';

  constructor(private router: Router,
    private fb: FormBuilder,
    private concessionComponentManagementService: ConcessionComponentManagementService,
    private concessionManagementService: ConcessionManagementService,
    private logger: LoggerService
  ) { }

  columns = [
    { key: 'concessionSubType', label: 'Concession Sub Type', sortable: true },
    { key: 'concessionSubCode', label: 'Code', sortable: true },
    { key: 'Concession Type', label: 'Concession Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  ngOnInit() {
    this.getAllDiscountTypes();
    this.getAllConcessionComponents();
    this.initializeForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.searchForm = this.fb.group({
      discountTypeId: [''],
      keyword: ['']
    });
  }

  getAllDiscountTypes() {
    this.concessionManagementService.getAllConcessions().subscribe({
      next: (response) => {
        this.discountTypesDD = response.body;
      },
      error: (error) => LoggerUtil.error(this.MODULE, 'Dropdowns', '❌ Failed to load discount types', error)
    });
  }

  getAllConcessionComponents() {
    this.isLoading = true;
    this.loadingMessage = 'Loading Sub Types...';
    this.concessionComponentManagementService.getAllConcessionComponent().subscribe({
      next: (response) => {
        this.concessionComponentResponse = response.body;
        this.pagination = new Pagination(this.concessionComponentResponse, 10);
        this.isLoading = false;
        this.loadingMessage = '';
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, 'List', '❌ Failed to load', error);
        this.toaster?.show('Failed to load Concession Sub Types', 'error');
        this.isLoading = false;
      }
    });
  }

  viewDetails(item: ConcessionComponentResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.CONCESSION.CONCESSION__SUB_TYPE.DETAILS(item.id.toString()));
  }

  editDetails(item: ConcessionComponentResponse, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(ROUTES.CONCESSION.CONCESSION__SUB_TYPE.EDIT(item.id.toString()));
  }

  refreshList(): void {
    this.getAllConcessionComponents();
  }

  toggleActive(item: ConcessionComponentResponse, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isLoading = true;
    this.loadingMessage = 'Updating status...';
    this.concessionComponentManagementService.toggleActive(item.id, !item.isActive).subscribe({
      next: () => {
        this.toaster?.show('Status updated successfully', 'success');
        this.refreshList();
      },
      error: (err) => {
        LoggerUtil.error(this.MODULE, 'Toggle', '❌ Failed to toggle active', err);
        this.toaster?.show('Failed to update status', 'error');
        this.isLoading = false;
        this.loadingMessage = '';
      }
    });
  }

  deleteConcessionComponent(item: ConcessionComponentResponse, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      this.isLoading = true;
      this.loadingMessage = 'Deleting...';
      this.concessionComponentManagementService.deleteConcessionComponent(item.id).subscribe({
        next: () => {
          this.toaster?.show('Concession Sub Type deleted successfully', 'success');
          this.refreshList();
        },
        error: (err) => {
          LoggerUtil.error(this.MODULE, 'Delete', '❌ Failed to delete', err);
          this.toaster?.show('Failed to delete', 'error');
          this.isLoading = false;
          this.loadingMessage = '';
        }
      });
    }
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }

  resetForm() {
    this.searchForm.reset({
      discountTypeId: '',
      keyword: ''
    });
    this.getAllConcessionComponents();
  }

  onSubmitSearch(): void {
    const formValues = this.searchForm.value;
    this.isLoading = true;
    this.loadingMessage = 'Searching...';
    this.concessionComponentManagementService.searchConcessionComponents(
      formValues.discountTypeId || undefined,
      formValues.keyword?.trim() || undefined
    ).subscribe({
      next: (response) => {
        this.concessionComponentResponse = response.body;
        this.pagination = new Pagination(this.concessionComponentResponse, 10);
        this.isLoading = false;
        this.loadingMessage = '';
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, 'Search', '❌ Failed to search', error);
        this.toaster?.show('Search failed', 'error');
        this.isLoading = false;
        this.loadingMessage = '';
      }
    });
  }
}
