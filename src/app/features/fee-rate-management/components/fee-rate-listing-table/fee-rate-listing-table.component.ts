import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Pagination } from '../../../../core/pagar/pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { FeeRateResponse } from '../../models/FeeRateResponse';
import { FeeRateManagementService } from '../../services/fee-rate-management.service';

@Component({
  selector: 'app-fee-rate-listing-table',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './fee-rate-listing-table.component.html',
  styleUrls: ['./fee-rate-listing-table.component.css']
})
export class FeeRateListingTableComponent {
  pagination: Pagination<FeeRateResponse> = new Pagination([], 10);
  feeRateResponse: FeeRateResponse[] = [];
  
  sectionsSearchForm !: FormGroup;
  campusesResponse: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private feeRateService: FeeRateManagementService
  ) { }

  columns = [
    { key: 'componentName', label: 'Fee Component Name', sortable: true },
    { key: 'componentCode', label: 'Fee Component Code', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'effectiveFrom', label: 'Effective From', sortable: true },
    { key: 'effectiveTo', label: 'Effective To', sortable: true },
    { key: 'status', label: 'Status', sortable: true },

    { key: 'campusName', label: 'Campus Name', sortable: true },

    
    { key: 'standardName', label: 'Standard Name', sortable: true },
    

    { key: 'feeCatalogName', label: 'Fee Catalog Name', sortable: true },
    { key: 'academicYear', label: 'Academic Year', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.initializeForm();
    this.getFeeRates();
    //this.getCampuses();
    //this.getStandards();
    //this.getSections();
  }

  private initializeForm() {
    this.sectionsSearchForm = this.fb.group({
      campusId: [''],
      standardId: [''],
      keyword: ['']
    });
  }

  getFeeRates() {
    this.feeRateService.getAllFeeRates().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
         this.feeRateResponse = response.body;
         this.pagination = new Pagination(this.feeRateResponse, 10);
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
//   private getCampuses() {
//     this.campusManagementService.getAllCampuses().subscribe({
//       next: (response) => {
//         console.log('✅ Success Status:', response.status);
//         console.log('📦 Response Body:', response.body);
//         this.campusesResponse = response.body;
//       },
//       error: (error) => {
//         console.error('❌ Request Error Status:', error.status);
//         console.error('Message:', error.message);
//       },
//       complete: () => {
//         console.log('🔚 Request Complete');
//       }
//     });



//   getStandards() {
//     this.standardManagementService.getAllStandards().subscribe({
//       next: (response) => {
//         console.log('✅ Success Status:', response.status);
//         console.log('📦 Response Body:', response.body);
//         this.sectionsResponse = response.body;
//       },
//       error: (error) => {
//         console.error('❌ Request Error Status:', error.status);
//         console.error('Message:', error.message);
//       },
//       complete: () => {
//         console.log('🔚 Request Complete');
//       }
//     })
//   }

//   getSections() {
//     this.sectionManagementService.getAllSection().subscribe({
//       next: (response) => {
//         console.log('✅ Success Status:', response.status);
//         console.log('📦 Response Body:', response.body);
//         this.sectionsResponse = response.body;
//         this.pagination = new Pagination(this.sectionsResponse, 10);
//       },
//       error: (error) => {
//         console.error('❌ Request Error Status:', error.status);
//         console.error('Message:', error.message);
//       },
//       complete: () => {
//         console.log('🔚 Request Complete');
//       }
//     })
//   }
//   viewFeeRateDetails(feeRate: FeeRateResponse, event: Event): void {
//     console.log('Viewing details for Fee Rate ID:', feeRate.id);
//     event.preventDefault();  // prevents anchor default behavior
//     this.router.navigate(ROUTES.FEE.FEE_RATE.DETAILS(feeRate.id.toString()));
//   }

//   editFeeRateDetails(feeRate: FeeRateResponse, event: Event): void {
//     event.preventDefault();  // prevents anchor default behavior
//     console.log('Editing Fee Rate ID:', feeRate.id);
//     this.router.navigate(ROUTES.FEE.FEE_RATE.EDIT(feeRate.id.toString()));
//   }

//   // deleteStandard(standardId: any, event: Event): void {
//   //   event.stopPropagation();

//   //   console.log('Deleting standard', standardId);
//   //   if (confirm('Are you sure you want to delete this Standard?')) {

//   //     this.standardManagementService.deleteCampus(standardId).subscribe({
//   //       next: (response) => {
//   //         console.log('✅ Delete Success Status:', response.status);
//   //         console.log('📦 Delete Response Body:', response.body);
//   //         // this.CampusData = this.CampusData.filter(t => t.CampusId !== CampusId);
//   //         console.log(`Campus ${standardId} deleted successfully`);
//   //       },
//   //       error: (error) => {
//   //         console.error('❌ Delete Error Status:', error.status);
//   //         console.error('Message:', error.message);
//   //       },
//   //       complete: () => {
//   //         console.log('🔚 Delete Complete');
//   //       }
//   //     })
//   //   }
//   // }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
//   onSubmitSearch(): void {
//     console.log('✅ Standard Search Form Data:', this.sectionsSearchForm.getRawValue());
//     let formValues = this.sectionsSearchForm.value;
//     let params = {
//       campusId: formValues.campusId,
//       standardId: formValues.standardId,
//       keyword: formValues.keyword?.trim() || ''
//     };

//     // this.sectionManagementService.searchSections(params).subscribe({
//     //   next: (response) => {
//     //     console.log('✅ Success Status:', response.status);
//     //     console.log('📦 Response Body:', response.body);
//     //     this.sectionsResponse = response.body;
//     //     this.pagination = new Pagination(this.sectionsResponse, 10);
//     //   },
//     //   error: (error) => {
//     //     console.error('❌ Post Error Status:', error.status);
//     //     console.error('Message:', error.message);
//     //     this.router.navigate(['/Campuss']);
//     //   },
//     //   complete: () => {
//     //     console.log('🔚 Post Complete');
//     //   }
//     // })
//   }
// }
}