import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
        console.log('✅ Success Status:', response.status);
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

  viewFeeCatalogDetails(feeCatelog: FeeCatalogResponse, event: Event): void {
    console.log('Viewing details for FeeCatalog ID:', feeCatelog.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.FEE.FEE_CATALOG.DETAILS(feeCatelog.id.toString()));
  }

  editFeeCatalogDetails(feeCatalog: FeeCatalogResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing FeeCatalog ID:', feeCatalog.id);
    this.router.navigate(ROUTES.FEE.FEE_CATALOG.EDIT(feeCatalog.id.toString()));
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
