import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CHARGE_TYPE_CLASSES, RECURRENCE_RULE_CLASSES } from '../../../../core/const/COLOR_CONST';
import { ConcessionRateResponse } from '../../models/ConcessionRateResponse';
import { ConcessionRateManagementService } from '../../services/concession-rate-management.service';
import { KeyValueOption } from '../../../fee-catalog-management/models/feeConfig';
import { FeeCatalogManagementService } from '../../../fee-catalog-management/services/fee-catalog-management.service';
import { ConcessionResponse } from '../../../concession-management/models/ConcessionResponse';
import { ConcessionManagementService } from '../../../concession-management/services/concession-management.service';
import { ConcessionComponentResponse, DiscountType } from '../../../concession-component-management/models/ConcessionComponentResponse';
import { ConcessionComponentManagementService } from '../../../concession-component-management/services/concession-component-management.service';
import { HttpParams } from '@angular/common/http';

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
  resourceData: ConcessionRateResponse[] = [];
  concessionComponentDD: ConcessionComponentResponse[] = [];
  recurrenceRuleDD: KeyValueOption[] = [];
  chargeTypeDD: KeyValueOption[] = [];
  feeCatalogResponse: ConcessionResponse[] = [];
  RECURRENCE_RULE_CLASSES = RECURRENCE_RULE_CLASSES;
  CHARGE_TYPE_CLASSES = CHARGE_TYPE_CLASSES;
  discountTypesDD: DiscountType[] = [];
  searchForm !: FormGroup;
  constructor(private router: Router,
    private fb: FormBuilder,
    private concessionRateManagementService: ConcessionRateManagementService,
    private concessionComponentManagementService: ConcessionComponentManagementService,
    private concessionManagementService: ConcessionManagementService,
    private feeCatalogManagementService: FeeCatalogManagementService,
  ) { }

  columns = [
    // { key: 'id', label: 'Id', sortable: true },
    { key: 'DiscountComponentName', label: 'Concession Component Name', sortable: true },
    { key: 'DiscountType', label: 'Concession Type', sortable: true },
    { key: 'chargeType', label: 'Charge Type', sortable: true },
    { key: 'recurrenceRule', label: 'Recurrence Rule', sortable: false },
    { key: 'value', label: 'Value', sortable: false },
    { key: 'academicYearName', label: 'Academic Year', sortable: false },
    { key: 'campus', label: 'Assigned Campus', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.getAllDiscountTypes()
    this.getConcessionCatalogMeta();
    this.getAllConcessionRates();
    this.initializeForm();
    this.onConcessionTypeChange();
  }

  private initializeForm() {
    this.searchForm = this.fb.group({
      discountTypeId: [''],
      discountSubTypeId: [''],
      chargeTypeId: [''],
      recurrenceRuleId: [''],
      keyword: ['']
    });
  }
  getAllDiscountTypes() {
    this.concessionManagementService.getAllConcessions().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.discountTypesDD = response.body;
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

  private getConcessionCatalogMeta() {
    this.feeCatalogManagementService.getFeeCatalogMeta().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);

        this.recurrenceRuleDD = Object.entries(response.body.recurrenceRules).map(
          ([key, label]) => ({ key, label: label as string })
        );

        this.chargeTypeDD = Object.entries(response.body.chargeTypes).map(
          ([key, label]) => ({ key, label: label as string })
        );
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

  viewDetails(item: ConcessionRateResponse, event: Event): void {
    console.log('Viewing details for item ID:', item.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_RATE.DETAILS(item.id.toString()));
  }

  editDetails(item: ConcessionRateResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing item item ID:', item.id);
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_RATE.EDIT(item.id.toString()));
  }

  onConcessionTypeChange() {
    this.searchForm.get('discountTypeId')?.valueChanges.subscribe(discountTypeId => {
      console.log("Discount changed:", discountTypeId);
      this.loadComponentsByConcessionId(discountTypeId);
    });
  }
  loadComponentsByConcessionId(concessionTypeId: any) {
    this.concessionComponentManagementService.getConcessionComponentsByTypeId(concessionTypeId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.concessionComponentDD = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        //this.router.navigate(['/Campuses']);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
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

  onSubmitSearch(): void {
    console.log('✅Search Form Data:', this.searchForm.getRawValue());
    let formValues = this.searchForm.value;
    let params = new HttpParams();

    if (formValues.discountTypeId != null) {
      params = params.set('discountTypeId', formValues.discountTypeId);
    }

    if (formValues.discountSubTypeId != null) {
      params = params.set('discountSubTypeId', formValues.discountSubTypeId);
    }

    if (formValues.chargeTypeId) {
      params = params.set('chargeTypeId', formValues.chargeTypeId);
    }

    if (formValues.recurrenceRuleId) {
      params = params.set('recurrenceRuleId', formValues.recurrenceRuleId);
    }

    if (formValues.keyword?.trim()) {
      params = params.set('keyword', formValues.keyword.trim());
    }

    this.concessionRateManagementService.search(params).subscribe({
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

  resetForm() {
    this.searchForm.reset({
      discountTypeId: '',
      discountSubTypeId: '',
      chargeTypeId: '',
      recurrenceRuleId: '',
      keyword: ''
    });
    this.concessionComponentDD = []
    this.getAllConcessionRates(); // reload all data
  }
  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
}
