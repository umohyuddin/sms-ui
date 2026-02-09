import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Pagination } from '../../../../core/pagar/pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { FeeCatalogComponentManagementService } from '../../services/fee-catalog-component-management.service';
import { FeeCatalogComponentResponse } from '../../models/FeeCatalogComponentResponse';
import { FeeCatalogManagementService } from '../../../fee-catalog-management/services/fee-catalog-management.service';
import { FeeCatalogResponse } from '../../../fee-catalog-management/models/FeeCatalogResponse';

@Component({
  selector: 'app-fee-catalog-component-listing-table',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './fee-catalog-component-listing-table.component.html',
  styleUrls: ['./fee-catalog-component-listing-table.component.css']
})
export class FeeCatalogComponentListingTableComponent {
  pagination: Pagination<FeeCatalogComponentResponse> = new Pagination([], 10);
  feeCatalogComponentResponse: FeeCatalogComponentResponse[] = [];
  feeCatalogResponseDD: FeeCatalogResponse[] = [];

  searchForm !: FormGroup;
  campusesResponse: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private feeCatalogManagementService: FeeCatalogManagementService,
    private feeCatalogComponentManagementService: FeeCatalogComponentManagementService
  , private logger: LoggerService) { }

  columns = [
    { key: 'componentName', label: 'Fee Component Name', sortable: true },
    { key: 'componentCode', label: 'Fee Component Code', sortable: true },
    { key: 'componentStatus', label: 'Fee Component Status', sortable: true },
    { key: 'feeCatelogName', label: 'Fee Catalog Name', sortable: true },
    { key: 'feeCatalogCode', label: 'Fee Catalog Code', sortable: true },
    { key: 'discountable', label: 'Discountable', sortable: true },

    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    this.getFeeCatalog()
    this.initializeForm();
    this.getFeeCatalogComponents();
  }
  getFeeCatalog() {
    this.feeCatalogManagementService.getAllFeeCatalogs().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.feeCatalogResponseDD = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });

  }

  private initializeForm() {
    this.searchForm = this.fb.group({
      feeCatalogId: [''],
      keyword: ['']
    });
  }

  getFeeCatalogComponents() {
    this.feeCatalogComponentManagementService.getAllFeeCatalogComponents().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);

        this.feeCatalogComponentResponse = response.body;
        this.pagination = new Pagination(this.feeCatalogComponentResponse, 10);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }
  viewSectionDetails(feeCatalogComponent: FeeCatalogComponentResponse, event: Event): void {
    console.log('Viewing details for Fee Catalog Component ID:', feeCatalogComponent.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.FEE.FEE_CATALOG_COMPONENT.DETAILS(feeCatalogComponent.id.toString()));
  }

  editSectionDetails(feeCatalogComponent: FeeCatalogComponentResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing Fee Catalog Component ID:', feeCatalogComponent.id);
    this.router.navigate(ROUTES.FEE.FEE_CATALOG_COMPONENT.EDIT(feeCatalogComponent.id.toString()));
  }


  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
  onSubmitSearch(): void {
    console.log('  Standard Search Form Data:', this.searchForm.getRawValue());
    let formValues = this.searchForm.value;
    let params = {
      feeCatalogId: formValues.feeCatalogId,
      keyword: formValues.keyword?.trim() || ''
    };

    this.feeCatalogComponentManagementService.searchFeeCatalogComponents(params).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.feeCatalogComponentResponse = response.body;
        this.pagination = new Pagination(this.feeCatalogComponentResponse, 10);
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

  resetForm() {
    this.searchForm.reset({
      feeCatalogId: '',
      keyword: ''
    });
    this.getFeeCatalogComponents(); // reload all data
  }
}
