import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Pagination } from '../../../../core/pagar/pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { SectionManagementService } from '../../services/section-management.service';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { SectionResponse } from '../../models/SectionResponse';

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
  standardsResponse: StandardResponse[] = [];

  sectionsSearchForm !: FormGroup;
  private destroy$ = new Subject<void>();
  campusesResponse: any;

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
    { key: 'campusCode', label: 'Campus Code', sortable: true }
  ];

  ngOnInit() {
    this.initializeForm();
    this.getCampuses();
    this.getStandards();
    this.getSections();
  }

  private initializeForm() {
    this.sectionsSearchForm = this.fb.group({
      campusId: [''],
      standardId: [''],
      keyword: ['']
    });
  }
  private getCampuses() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.campusesResponse = response.body;
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

  getStandards() {
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

  getSections() {
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
  viewSectionDetails(section: SectionResponse, event: Event): void {
    console.log('Viewing details for Section ID:', section.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.CAMPUS.SECTION.DETAILS(section.id.toString()));
  }

  editSectionDetails(section: SectionResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing Section ID:', section.id);
    this.router.navigate(ROUTES.CAMPUS.SECTION.EDIT(section.id.toString()));
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

    this.sectionManagementService.searchSections(params).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.sectionsResponse = response.body;
        this.pagination = new Pagination(this.sectionsResponse, 10);
      },
      error: (error) => {
        console.error('❌ Post Error Status:', error.status);
        console.error('Message:', error.message);
        this.router.navigate(['/Campuss']);
      },
      complete: () => {
        console.log('🔚 Post Complete');
      }
    })
  }
}
