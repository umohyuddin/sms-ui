import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CHARGE_TYPE_CLASSES, RECURRENCE_RULE_CLASSES } from '../../../../core/const/COLOR_CONST';
import { ConcessionRateResponse } from '../../models/ConcessionRateResponse';
import { ConcessionRateManagementService } from '../../services/concession-rate-management.service';

@Component({
  selector: 'app-concession-rate-listing-table',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './concession-rate-listing-table.component.html',
  styleUrls: ['./concession-rate-listing-table.component.css']
})
export class ConcessionRateListingTableComponent {
  pagination: Pagination<ConcessionRateResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  resourceData: ConcessionRateResponse[] = [];
  RECURRENCE_RULE_CLASSES = RECURRENCE_RULE_CLASSES;
  CHARGE_TYPE_CLASSES = CHARGE_TYPE_CLASSES;
  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private concessionRateManagementService: ConcessionRateManagementService,
  ) { }

  columns = [
    // { key: 'id', label: 'Id', sortable: true },
    { key: 'feeCatalogName', label: 'Fee Catalog Name', sortable: true },
    { key: 'feeCatalogCode', label: 'Fee Catalog Code', sortable: true },
    { key: 'chargeType', label: 'Charge Type', sortable: true },
    { key: 'recurrenceRule', label: 'Recurrence Rule', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.getAllConcessionRates();
    this.SubscribeToSearch();
  }

  private SubscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.concessionRateManagementService.searchConcessionRate(search || '')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.resourceData = response.body;
          this.pagination = new Pagination(this.resourceData, 10);
        },
        error: (error) => {
          console.error('Search error:', error);
        }
      });
  }

  getAllConcessionRates() {
    this.concessionRateManagementService.getAllConcessionRates().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.resourceData = response.body;
        this.pagination = new Pagination(this.resourceData, 10);
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

  viewDetails(item: ConcessionRateResponse, event: Event): void {
    console.log('Viewing details for item ID:', item.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_TYPE.DETAILS(item.id.toString()));
  }

  editDetails(item: ConcessionRateResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing item item ID:', item.id);
    this.router.navigate(ROUTES.CONCESSION.CONCESSION__SUB_TYPE.EDIT(item.id.toString()));
  }

  // deleteCampus(campusId: any, event: Event): void {
  //   event.stopPropagation();

  //   console.log('Deleting Campus:', campusId);
  //   if (confirm('Are you sure you want to delete this Campus?')) {

  //     this.feeCatalogManagementService.deleteCampus(campusId).subscribe({
  //       next: (response) => {
  //         console.log('✅ Delete Success Status:', response.status);
  //         console.log('📦 Delete Response Body:', response.body);
  //         // this.CampusData = this.CampusData.filter(t => t.CampusId !== CampusId);
  //         console.log(`Campus ${campusId} deleted successfully`);
  //       },
  //       error: (error) => {
  //         console.error('❌ Delete Error Status:', error.status);
  //         console.error('Message:', error.message);
  //       },
  //       complete: () => {
  //         console.log('🔚 Delete Complete');
  //       }
  //     })
  //   }
  // }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
}
