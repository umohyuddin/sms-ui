import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Pagination } from '../../../../core/pagar/pagination';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CHARGE_TYPE_CLASSES, RECURRENCE_RULE_CLASSES } from '../../../../core/const/COLOR_CONST';
import { ConcessionComponentResponse, DiscountType } from '../../models/ConcessionComponentResponse';
import { ConcessionComponentManagementService } from '../../services/concession-component-management.service';
import { ConcessionManagementService } from '../../../concession-management/services/concession-management.service';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-concession-component-listing-table',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './concession-component-listing-table.component.html',
  styleUrls: ['./concession-component-listing-table.component.css']
})
export class ConcessionListingTableComponent {
  pagination: Pagination<ConcessionComponentResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  concessionComponentResponse: ConcessionComponentResponse[] = [];
  RECURRENCE_RULE_CLASSES = RECURRENCE_RULE_CLASSES;
  CHARGE_TYPE_CLASSES = CHARGE_TYPE_CLASSES;
  searchForm !: FormGroup;
  discountTypesDD: DiscountType[] = [];
  
  constructor(private router: Router,
    private fb: FormBuilder,
    private concessionComponentManagementService: ConcessionComponentManagementService,
    private concessionManagementService: ConcessionManagementService,
    private logger: LoggerService
  ) { }

  columns = [
    // { key: 'id', label: 'Id', sortable: true },
    { key: 'concessionSubType', label: 'Concession Sub Type', sortable: true },
    { key: 'concessionSubCode', label: 'Concession Sub Type Code', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'Concession Type', label: 'Concession Type', sortable: true },
    // { key: 'chargeType', label: 'Charge Type', sortable: false },
    // { key: 'recurrenceRule', label: 'Recurrence Rule', sortable: false },

    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.getAllDiscountTypes()
    this.getAllConcessionComponents();
    this.initializeForm();
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
        console.log('  Success Status:', response.status);
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

  getAllConcessionComponents() {
    this.concessionComponentManagementService.getAllConcessionComponent().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.concessionComponentResponse = response.body;
        this.pagination = new Pagination(this.concessionComponentResponse, 10);
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

  viewDetails(item: ConcessionComponentResponse, event: Event): void {
    console.log('Viewing details for item ID:', item.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.CONCESSION.CONCESSION__SUB_TYPE.DETAILS(item.id.toString()));
  }

  editDetails(item: ConcessionComponentResponse, event: Event): void {
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
  //         console.log('  Delete Success Status:', response.status);
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
  resetForm() {
    this.searchForm.reset({
      discountTypeId: '',
      keyword: ''
    });
    this.getAllConcessionComponents(); // reload all data
  }

  onSubmitSearch(): void {
    console.log('  Standard Search Form Data:', this.searchForm.getRawValue());
    let formValues = this.searchForm.value;
    let params = {
      discountTypeId: formValues.discountTypeId,
      keyword: formValues.keyword?.trim() || ''
    };

    this.concessionComponentManagementService.searchConcessionComponents(params).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.concessionComponentResponse = response.body;
        this.pagination = new Pagination(this.concessionComponentResponse, 10);
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

}
