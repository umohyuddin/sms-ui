import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Pagination } from '../../../../core/pagar/pagination';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CHARGE_TYPE_CLASSES, RECURRENCE_RULE_CLASSES } from '../../../../core/const/COLOR_CONST';
import { ConcessionRateResponse } from '../../models/ConcessionRateResponse';
import { ConcessionRateManagementService } from '../../services/concession-rate-management.service';
import { ConcessionComponentManagementService } from '../../../concession-component-management/services/concession-component-management.service';
import { ConcessionManagementService } from '../../../concession-management/services/concession-management.service';
import { ConcessionResponse } from '../../../concession-management/models/ConcessionResponse';
import { ConcessionComponentResponse } from '../../../concession-component-management/models/ConcessionComponentResponse';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { LoggerService } from '../../../../core/services/logger.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-concession-rate-listing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoaderComponent, ToasterComponent],
  templateUrl: './concession-rate-listing-table.component.html',
  styleUrls: ['./concession-rate-listing-table.component.css']
})
export class ConcessionRateListingTableComponent implements OnInit, OnDestroy {
  pagination: Pagination<ConcessionRateResponse> = new Pagination([], 10);
  searchForm!: FormGroup;
  resourceData: ConcessionRateResponse[] = [];
  
  CHARGE_TYPE_CLASSES = CHARGE_TYPE_CLASSES;
  RECURRENCE_RULE_CLASSES = RECURRENCE_RULE_CLASSES;
  
  discountTypesDD: ConcessionResponse[] = [];
  concessionComponentDD: ConcessionComponentResponse[] = [];
  campuseDD: CampusResponse[] = [];
  academicYear: AcademicYearResponse | null = null;
  
  isLoading = false;
  loadingMessage = '';
  viewMode: 'grid' | 'table' = 'grid';

  toggleView(mode: 'grid' | 'table'): void {
    this.viewMode = mode;
  }
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  private destroy$ = new Subject<void>();
  private readonly MODULE = 'ConcessionRate';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private concessionRateManagementService: ConcessionRateManagementService,
    private concessionComponentManagementService: ConcessionComponentManagementService,
    private concessionManagementService: ConcessionManagementService,
    private campusManagementService: CampusManagementService,
    private configService: AppConfigService,
    private logger: LoggerService
  ) { }

  columns = [
    { key: 'concessionSubType', label: 'Concession Component', sortable: true },
    { key: 'ConcessionType', label: 'Concession Type', sortable: true },
    { key: 'chargeType', label: 'Charge Type', sortable: true },
    { key: 'recurrenceRule', label: 'Recurrence Rule', sortable: true },
    { key: 'value', label: 'Rate Value', sortable: true },
    { key: 'effectiveDate', label: 'Effective Date', sortable: true },
    { key: 'academicYearName', label: 'Academic Year', sortable: true },
    { key: 'campusName', label: 'Campus', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  ngOnInit() {
    this.academicYear = this.configService.getAcademicYear();
    this.initializeForm();
    this.loadDropdowns();
    this.getAllConcessionRates();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.searchForm = this.fb.group({
      discountTypeId: [''],
      discountSubTypeId: [''],
      campusId: [''],
      academicYearId: [this.academicYear?.id],
      keyword: ['']
    });

    this.searchForm.get('discountTypeId')?.valueChanges.subscribe(typeId => {
      this.searchForm.get('discountSubTypeId')?.setValue('');
      if (typeId) {
        this.loadComponentsByConcessionId(typeId);
      } else {
        this.concessionComponentDD = [];
      }
    });
  }

  private loadDropdowns() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: (res) => this.campuseDD = res.body,
      error: (err) => LoggerUtil.error(this.MODULE, 'Dropdowns', '❌ Campuses failed', err)
    });

    this.concessionManagementService.getAllConcessions().subscribe({
      next: (res) => this.discountTypesDD = res.body,
      error: (err) => LoggerUtil.error(this.MODULE, 'Dropdowns', '❌ Types failed', err)
    });
  }

  private loadComponentsByConcessionId(concessionTypeId: any) {
    this.concessionComponentManagementService.getConcessionComponentsByTypeId(concessionTypeId).subscribe({
      next: (res) => this.concessionComponentDD = res.body || [],
      error: (err) => LoggerUtil.error(this.MODULE, 'Dropdowns', '❌ SubTypes failed', err)
    });
  }

  getAllConcessionRates() {
    this.isLoading = true;
    this.loadingMessage = 'Loading Rates...';
    this.concessionRateManagementService.getAllConcessionRates().subscribe({
      next: (response) => {
        this.resourceData = response.body;
        this.pagination = new Pagination(this.resourceData, 10);
        this.isLoading = false;
        this.loadingMessage = '';
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, 'List', '❌ Failed to load', error);
        this.toaster?.show('Failed to load Concession Rates', 'error');
        this.isLoading = false;
      }
    });
  }

  viewDetails(item: ConcessionRateResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_RATE.DETAILS(item.id.toString()));
  }

  editDetails(item: ConcessionRateResponse, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_RATE.EDIT(item.id.toString()));
  }

  refreshList(): void {
    this.onSubmitSearch(); // refresh with current filters
  }

  toggleActive(item: ConcessionRateResponse, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isLoading = true;
    this.loadingMessage = 'Updating status...';
    this.concessionRateManagementService.toggleActive(item.id, !item.isActive).subscribe({
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

  deleteConcessionRate(item: ConcessionRateResponse, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete this Concession Rate?`)) {
      this.isLoading = true;
      this.loadingMessage = 'Deleting...';
      this.concessionRateManagementService.deleteConcessionRate(item.id).subscribe({
        next: () => {
          this.toaster?.show('Concession Rate deleted successfully', 'success');
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
      academicYearId: this.academicYear?.id,
      campusId: '',
      discountTypeId: '',
      discountSubTypeId: '',
      keyword: ''
    });
    this.getAllConcessionRates();
  }

  onSubmitSearch(): void {
    const formValues = this.searchForm.value;
    this.isLoading = true;
    this.loadingMessage = 'Searching...';
    this.concessionRateManagementService.search(formValues).subscribe({
      next: (response) => {
        this.resourceData = response.body;
        this.pagination = new Pagination(this.resourceData, 10);
        this.isLoading = false;
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, 'Search', '❌ Failed to search', error);
        this.toaster?.show('Search failed', 'error');
        this.isLoading = false;
      }
    });
  }
}
