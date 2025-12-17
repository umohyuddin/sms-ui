import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Pagination } from '../../../../core/pagar/pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { SectionManagementService } from '../../../section-management/services/section-management.service';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { SectionResponse } from '../../../section-management/models/SectionResponse';
import { EmployeeResponse } from '../../models/EmployeeResponse';


@Component({
  selector: 'app-employee-listing-table',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './employee-listing-table.component.html',
  styleUrls: ['./employee-listing-table.component.css']
})
export class EmployeeListingTableComponent {
  pagination: Pagination<EmployeeResponse> = new Pagination([], 10);
  employeeResponse: EmployeeResponse[] = [];
  sectionsResponse: SectionResponse[] = [];
  standardsResponse: StandardResponse[] = [];
  employeeSearchForm !: FormGroup;
  campusesResponse: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeManagementService: EmployeeManagementService,
    private campusManagementService: CampusManagementService,
    private standardManagementService: StandardManagementService,
    private sectionManagementService: SectionManagementService
  ) { }

  columns = [
    { key: 'rollNumber', label: 'Roll #', sortable: true },
    { key: 'studentCode', label: 'Student Code', sortable: true },
    { key: 'fullName', label: 'Full Name', sortable: true },
    { key: 'fisrtName', label: 'First Name', sortable: true },
    { key: 'lastName', label: 'Last Name', sortable: true },
    { key: 'phone', label: 'Contact #', sortable: true },
    { key: 'gender', label: 'Gender', sortable: true },
    { key: 'dob', label: 'DOB', sortable: true },

    { key: 'crc', label: 'CRC', sortable: true },
    { key: 'cnic', label: 'CNIC', sortable: true },

    { key: 'isActive', label: 'Status', sortable: true },
    { key: 'enrollmentDate', label: 'Enrollment Date', sortable: true },
    { key: 'standardName', label: 'Standard Name', sortable: true },
    { key: 'standardCode', label: 'Standard Code', sortable: true },
    { key: 'campusName', label: 'Campus Name', sortable: true },
    { key: 'campusCode', label: 'Campus Code', sortable: true },
    { key: 'action', label: 'Action', sortable: true }
  ];

  ngOnInit() {
    this.initializeForm();
    this.getAllEmployee()
    //this.getCampuses();
    //this.getStandards();
    //this.getSections();
  }


  private initializeForm() {
    this.employeeSearchForm = this.fb.group({
      campusId: [''],
      standardId: [''],
      sectionId: [''],
      keyword: ['']
    });
  }
  private getCampuses() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
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

  getAllEmployee() {
    this.employeeManagementService.getAllEmployee().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.employeeResponse = response.body;
        this.pagination = new Pagination(this.employeeResponse, 10);
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
  // getStandards() {
  //   this.standardManagementService.getAllStandards().subscribe({
  //     next: (response) => {
  //       console.log('  Success Status:', response.status);
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
  //       console.log('  Success Status:', response.status);
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
  viewStudentDetails(employee: EmployeeResponse, event: Event): void {
    console.log('Viewing details for employee ID:', employee.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.EMPLOYEE.DETAILS(employee.id.toString()));
  }

  editStudentDetails(employee: EmployeeResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing employee ID:', employee.id);
    this.router.navigate(ROUTES.EMPLOYEE.EDIT(employee.id.toString()));
  }

  // deleteStandard(standardId: any, event: Event): void {
  //   event.stopPropagation();

  //   console.log('Deleting standard', standardId);
  //   if (confirm('Are you sure you want to delete this Standard?')) {

  //     this.standardManagementService.deleteCampus(standardId).subscribe({
  //       next: (response) => {
  //         console.log('  Delete Success Status:', response.status);
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
    console.log('Employee Search Form Data:', this.employeeSearchForm.getRawValue());
    let formValues = this.employeeSearchForm.value;
    let params = {
      campusId: formValues.campusId,
      standardId: formValues.standardId,
      keyword: formValues.keyword?.trim() || ''
    };

    this.employeeManagementService.searchEmployee(params).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.employeeResponse = response.body;
        this.pagination = new Pagination(this.employeeResponse, 10);
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
