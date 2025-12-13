import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Pagination } from '../../../../core/pagar/pagination';
import { StandardResponse } from '../../models/standardResponse';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { StandardManagementService } from '../../services/standard-management.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';

@Component({
  selector: 'app-standard-listing-table',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule],
  templateUrl: './standard-listing-table.component.html',
  styleUrls: ['./standard-listing-table.component.css']
})
export class StandardListingTableComponent {
  pagination: Pagination<StandardResponse> = new Pagination([], 10);
  standardsResponse: StandardResponse[] = [];
  standardSearchForm !: FormGroup;
  campusesResponse: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private standardManagementService: StandardManagementService,
    private campusManagementService: CampusManagementService
  ) { }

  columns = [
    { key: 'standardName', label: 'Standard Name', sortable: true },
    { key: 'standardCode', label: 'Standard Code', sortable: true },
    { key: 'campusName', label: 'Campus Name', sortable: true },
    { key: 'campusCode', label: 'Campus Code', sortable: true },
        { key: 'action', label: 'Action', sortable: true }
  ];

  ngOnInit() {
    this.initializeForm();
    this.getCampuses();
    this.getStandards();
  }
  private initializeForm() {
    this.standardSearchForm = this.fb.group({
      campusId: [''],
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


  resetForm() {
    //this.standardSearchForm.reset();
    this.standardSearchForm.reset({
      campusId: '',  // reset to default values
      keyword: ''
    });
    this.getStandards(); // reload all data
  }
  getStandards() {
    this.standardManagementService.getAllStandards().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.standardsResponse = response.body;
        this.pagination = new Pagination(this.standardsResponse, 10);
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

  viewStandardDetails(standard: StandardResponse, event: Event): void {
    console.log('Viewing details for Standard ID:', standard.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.CAMPUS.STANDARD.DETAILS(standard.id.toString()));
  }

  editStandardDetails(standard: StandardResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing Standard ID:', standard.id);
    this.router.navigate(ROUTES.CAMPUS.STANDARD.EDIT(standard.id.toString()));
  }

  deleteStandard(standardId: any, event: Event): void {
    event.stopPropagation();

    console.log('Deleting standard', standardId);
    if (confirm('Are you sure you want to delete this Standard?')) {

      this.standardManagementService.deleteCampus(standardId).subscribe({
        next: (response) => {
          console.log('✅ Delete Success Status:', response.status);
          console.log('📦 Delete Response Body:', response.body);
          // this.CampusData = this.CampusData.filter(t => t.CampusId !== CampusId);
          console.log(`Campus ${standardId} deleted successfully`);
        },
        error: (error) => {
          console.error('❌ Delete Error Status:', error.status);
          console.error('Message:', error.message);
        },
        complete: () => {
          console.log('🔚 Delete Complete');
        }
      })
    }
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
  onSubmit(): void {
    console.log('✅ Standard Search Form Data:', this.standardSearchForm.getRawValue());
    let formValues = this.standardSearchForm.value;
    let params = {
      campusId: formValues.campusId,
      keyword: formValues.keyword?.trim() || ''
    };

    this.standardManagementService.searchStandards(params).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.standardsResponse = response.body;
        this.pagination = new Pagination(this.standardsResponse, 10);
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
