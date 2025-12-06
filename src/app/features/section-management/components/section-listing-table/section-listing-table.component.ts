import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Pagination } from '../../../../core/pagar/pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { SectionManagementService } from '../../services/section-management.service';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { Campus, SectionResponse } from '../../models/SectionResponse';

@Component({
  selector: 'app-section-listing-table',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './section-listing-table.component.html',
  styleUrls: ['./section-listing-table.component.css']
})
export class SectionListingTableComponent {
  pagination: Pagination<SectionResponse> = new Pagination([], 10);
  sectionsResponse: SectionResponse[] = [];

  standardsResponseDD: StandardResponse[] = [];

  sectionsSearchForm !: FormGroup;
  campusesResponseDD: Campus[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private campusManagementService: CampusManagementService,
    private standardManagementService: StandardManagementService,
    private sectionManagementService: SectionManagementService
  ) { }

  columns = [
    { key: 'sectionName', label: 'Section Name', sortable: true },
    { key: 'sectionCode', label: 'Section Code', sortable: true },
    { key: 'standardName', label: 'Standard Name', sortable: true },
    { key: 'standardCode', label: 'Standard Code', sortable: true },
    { key: 'campusName', label: 'Campus Name', sortable: true },
    { key: 'campusCode', label: 'Campus Code', sortable: true },
    { key: 'action', label: 'Action', sortable: true }
  ];

  ngOnInit() {
    this.initializeForm();
    this.getCampuses();
    this.getAllSections();

    this.onCampusChange()
  }

  private initializeForm() {
    this.sectionsSearchForm = this.fb.group({
      campusId: [''],
      standardId: [''],
      keyword: ['']
    });
  }

  onCampusChange() {
    this.sectionsSearchForm.get('campusId')?.valueChanges.subscribe(campusId => {
      console.log("Campus changed:", campusId);
      this.loadStandardsByCampus(campusId);
    });
  }
  loadStandardsByCampus(campusId: any) {
    this.standardManagementService.getCampusById(campusId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.standardsResponseDD = response.body;
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


  private getCampuses() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.campusesResponseDD = response.body;
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

  private getStandards() {
    this.standardManagementService.getAllStandards().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.sectionsResponse = response.body;
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

  getAllSections() {
    this.sectionManagementService.getAllSection().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.sectionsResponse = response.body;
        this.pagination = new Pagination(this.sectionsResponse, 10);
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

  viewSectionDetails(item: SectionResponse, event: Event): void {
    console.log('Viewing details for Section ID:', item.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.CAMPUS.SECTION.DETAILS(item.id.toString()));
  }

  editSectionDetails(item: SectionResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing Section ID:', item.id);
    this.router.navigate(ROUTES.CAMPUS.SECTION.EDIT(item.id.toString()));
  }


  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
  onSubmitSearch(): void {
    console.log('✅Search Form Data:', this.sectionsSearchForm.getRawValue());
    let formValues = this.sectionsSearchForm.value;
    let params = {
      campusId: formValues.campusId,
      standardId: formValues.standardId,
      keyword: formValues.keyword?.trim() || ''
    };

    this.sectionManagementService.searchSections(params).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.sectionsResponse = response.body;
        this.pagination = new Pagination(this.sectionsResponse, 10);
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
    //this.standardSearchForm.reset();
    this.sectionsSearchForm.reset({
      campusId: '',  // reset to default values
      standardId: '',
      keyword: ''
    });
    this.getAllSections(); // reload all data
  }
}
