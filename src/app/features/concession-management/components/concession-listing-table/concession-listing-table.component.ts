import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../../../core/services/logger.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { ConcessionResponse } from '../../models/ConcessionResponse';
import { ConcessionManagementService } from '../../services/concession-management.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CHARGE_TYPE_CLASSES, RECURRENCE_RULE_CLASSES } from '../../../../core/const/COLOR_CONST';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { SmsUtil } from '../../../../core/utils/smsUtil';

@Component({
  selector: 'app-concession-listing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoaderComponent, ToasterComponent],
  templateUrl: './concession-listing-table.component.html',
  styleUrls: ['./concession-listing-table.component.css']
})
export class ConcessionListingTableComponent implements OnInit, OnDestroy {
  pagination: Pagination<ConcessionResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  concessionResponse: ConcessionResponse[] = [];
  RECURRENCE_RULE_CLASSES = RECURRENCE_RULE_CLASSES;
  CHARGE_TYPE_CLASSES = CHARGE_TYPE_CLASSES;
  isLoading = false;
  loadingMessage = '';
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  private destroy$ = new Subject<void>();
  private readonly MODULE = 'ConcessionType';

  constructor(
    private router: Router,
    private concessionManagementService: ConcessionManagementService,
    private logger: LoggerService
  ) { }

  columns = [
    { key: 'name', label: 'Concession Type Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'chargeType', label: 'Charge Type', sortable: true },
    { key: 'recurrenceRule', label: 'Recurrence Rule', sortable: false },
    { key: 'active', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  ngOnInit() {
    this.logger.log('ngOnInit called', this.constructor.name);
    this.getAllConcessions();
    this.subscribeToSearch();
  }

  private subscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => {
          this.isLoading = true;
          this.loadingMessage = 'Searching...';
          return this.concessionManagementService.searchDiscountTypes(search || '');
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.concessionResponse = response.body;
          this.pagination = new Pagination(this.concessionResponse, 10);
          this.isLoading = false;
          this.loadingMessage = '';
        },
        error: (error) => {
          this.isLoading = false;
          this.loadingMessage = '';
          LoggerUtil.error(this.MODULE, 'Search', '❌ Search failed', error);
          this.toaster?.show('Search failed.', 'error');
        }
      });
  }

  getClass(code: string): string {
    return SmsUtil.getPillColor(code);
  }

  getAllConcessions() {
    this.isLoading = true;
    this.loadingMessage = 'Loading Concession Types...';
    this.concessionManagementService.getAllConcessions().subscribe({
      next: (response) => {
        this.concessionResponse = response.body;
        this.pagination = new Pagination(this.concessionResponse, 10);
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        LoggerUtil.error(this.MODULE, 'List', '❌ Failed to load concession types', error);
        this.toaster?.show('Failed to load Concession Types.', 'error');
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
      }
    });
  }

  viewDetails(item: ConcessionResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_TYPE.DETAILS(item.id.toString()));
  }

  editDetails(item: ConcessionResponse, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_TYPE.EDIT(item.id.toString()));
  }

  refreshList(): void {
    this.getAllConcessions();
  }

  toggleActive(item: ConcessionResponse, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const payload = { ...item, active: !item.active, chargeTypeId: item.chargeType?.id, recurrenceRuleId: item.recurrenceRule?.id };
    this.isLoading = true;
    this.loadingMessage = 'Updating status...';
    this.concessionManagementService.saveConcession(item.id, payload).subscribe({
      next: () => {
        this.toaster?.show('Status updated successfully', 'success');
        this.getAllConcessions();
      },
      error: (err) => {
        LoggerUtil.error(this.MODULE, 'Toggle', '❌ Failed to toggle active', err);
        this.toaster?.show('Failed to update status', 'error');
        this.isLoading = false;
        this.loadingMessage = '';
      }
    });
  }

  deleteConcession(item: ConcessionResponse, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      this.isLoading = true;
      this.loadingMessage = 'Deleting...';
      this.concessionManagementService.deleteConcession(item.id).subscribe({
        next: () => {
          this.toaster?.show('Concession deleted successfully', 'success');
          this.getAllConcessions();
        },
        error: (err) => {
          LoggerUtil.error(this.MODULE, 'Delete', '❌ Failed to delete concession', err);
          this.toaster?.show('Failed to delete concession', 'error');
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


