import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Pagination } from '../../../../core/pagar/pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { FeeCatalogComponentManagementService } from '../../services/fee-catalog-component-management.service';
import { FeeCatalogComponentResponse } from '../../models/FeeCatalogComponentResponse';
import { FeeCatalogManagementService } from '../../../fee-catalog-management/services/fee-catalog-management.service';

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
  standardsResponse: StandardResponse[] = [];

  sectionsSearchForm !: FormGroup;
  private destroy$ = new Subject<void>();
  campusesResponse: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private feeCatalogManagementService: FeeCatalogManagementService,
    private feeCatalogComponentManagementService: FeeCatalogComponentManagementService
  ) { }

  columns = [
    { key: 'componentName', label: 'Fee Component Name', sortable: true },
    { key: 'componentCode', label: 'Fee Component Code', sortable: true },
    { key: 'componentStatus', label: 'Fee Component Status', sortable: true },
    { key: 'feeCatelogName', label: 'Fee Catalog Name', sortable: true },
    { key: 'feeCatalogCode', label: 'Fee Catalog Code', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.initializeForm();
    this.getFeeCatalogComponents();
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

  getFeeCatalogComponents() {
    this.feeCatalogComponentManagementService.getAllFeeCatalogComponents().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
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
  // private getCampuses() {
  //   this.campusManagementService.getAllCampuses().subscribe({
  //     next: (response) => {
  //       console.log('✅ Success Status:', response.status);
  //       console.log('📦 Response Body:', response.body);
  //       this.campusesResponse = response.body;
  //     },
  //     error: (error) => {
  //       console.error('❌ Request Error Status:', error.status);
  //       console.error('Message:', error.message);
  //     },
  //     complete: () => {
  //       console.log('🔚 Request Complete');
  //     }
  //   });



  // getStandards() {
  //   this.standardManagementService.getAllStandards().subscribe({
  //     next: (response) => {
  //       console.log('✅ Success Status:', response.status);
  //       console.log('📦 Response Body:', response.body);
  //       this.sectionsResponse = response.body;
  //     },
  //     error: (error) => {
  //       console.error('❌ Request Error Status:', error.status);
  //       console.error('Message:', error.message);
  //     },
  //     complete: () => {
  //       console.log('🔚 Request Complete');
  //     }
  //   })
  // }

  // getSections() {
  //   this.sectionManagementService.getAllSection().subscribe({
  //     next: (response) => {
  //       console.log('✅ Success Status:', response.status);
  //       console.log('📦 Response Body:', response.body);
  //       this.sectionsResponse = response.body;
  //       this.pagination = new Pagination(this.sectionsResponse, 10);
  //     },
  //     error: (error) => {
  //       console.error('❌ Request Error Status:', error.status);
  //       console.error('Message:', error.message);
  //     },
  //     complete: () => {
  //       console.log('🔚 Request Complete');
  //     }
  //   })
  // }
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

  // deleteStandard(standardId: any, event: Event): void {
  //   event.stopPropagation();

  //   console.log('Deleting standard', standardId);
  //   if (confirm('Are you sure you want to delete this Standard?')) {

  //     this.standardManagementService.deleteCampus(standardId).subscribe({
  //       next: (response) => {
  //         console.log('✅ Delete Success Status:', response.status);
  //         console.log('📦 Delete Response Body:', response.body);
  //         // this.CampusData = this.CampusData.filter(t => t.CampusId !== CampusId);
  //         console.log(`Campus ${standardId} deleted successfully`);
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
  onSubmitSearch(): void {
    console.log('✅ Standard Search Form Data:', this.sectionsSearchForm.getRawValue());
    let formValues = this.sectionsSearchForm.value;
    let params = {
      campusId: formValues.campusId,
      standardId: formValues.standardId,
      keyword: formValues.keyword?.trim() || ''
    };

    // this.sectionManagementService.searchSections(params).subscribe({
    //   next: (response) => {
    //     console.log('✅ Success Status:', response.status);
    //     console.log('📦 Response Body:', response.body);
    //     this.sectionsResponse = response.body;
    //     this.pagination = new Pagination(this.sectionsResponse, 10);
    //   },
    //   error: (error) => {
    //     console.error('❌ Post Error Status:', error.status);
    //     console.error('Message:', error.message);
    //     this.router.navigate(['/Campuss']);
    //   },
    //   complete: () => {
    //     console.log('🔚 Post Complete');
    //   }
    // })
  }
}
