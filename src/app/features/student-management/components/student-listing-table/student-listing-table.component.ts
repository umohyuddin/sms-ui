import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Pagination } from '../../../../core/pagar/pagination';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoggerService } from '../../../../core/services/logger.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { SectionManagementService } from '../../../section-management/services/section-management.service';
import { StudentManagementService } from '../../services/student-management.service';
import { SectionResponse } from '../../../section-management/models/SectionResponse';
import { StudentResponse } from '../../models/StudentResponse';
import { GENDER_CLASSES } from '../../../../core/const/COLOR_CONST';


@Component({
  selector: 'app-student-listing-table',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './student-listing-table.component.html',
  styleUrls: ['./student-listing-table.component.css']
})
export class StudentListingTableComponent {
  pagination: Pagination<StudentResponse> = new Pagination([], 10);
  studentsResponse: StudentResponse[] = [];
  sectionsResponse: SectionResponse[] = [];
  standardsResponse: StandardResponse[] = [];
  studentSearchForm !: FormGroup;
  private destroy$ = new Subject<void>();
  campusesResponse: any;
  genderClasses = GENDER_CLASSES;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private studentManagementService: StudentManagementService,
    private campusManagementService: CampusManagementService,
    private standardManagementService: StandardManagementService,
    private sectionManagementService: SectionManagementService,
    private logger: LoggerService
  ) { }

  columns = [
    { key: 'studentCode', label: 'Student Code', sortable: true },
    { key: 'fullName', label: 'Full Name', sortable: true },
    { key: 'fisrtName', label: 'First Name', sortable: true },
    { key: 'lastName', label: 'Last Name', sortable: true },
    { key: 'phone', label: 'Contact #', sortable: true },
    { key: 'gender', label: 'Gender', sortable: true },
    { key: 'dob', label: 'DOB', sortable: true },
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
    this.getAllStudents()
    this.getCampuses();
    this.onCampusChange()
    //this.getStandards();
    //this.getSections();
  }


  private initializeForm() {
    this.studentSearchForm = this.fb.group({
      campusId: [''],
      standardId: [''],
      sectionId: [''],
      keyword: ['']
    });
  }
  private getCampuses() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: (response) => {
        this.logger.success('Success Status', response.status);
        this.logger.info('Response Body', response.body);
        this.campusesResponse = response.body;
      },
      error: (error) => {
        this.logger.error('Request Error Status', error.status);
        this.logger.error('Message', error.message);
      },
      complete: () => {
        this.logger.complete('Request Complete');
      }
    });
  }

  onCampusChange() {
    this.studentSearchForm.get('campusId')?.valueChanges.subscribe(campusId => {
      this.logger.info('Campus changed', campusId);
      this.loadStandardByCampusId(campusId);
    });
  }
  loadStandardByCampusId(campusId: any) {
    this.studentSearchForm.get('standardId')?.setValue('')
    this.standardManagementService.getCampusById(campusId).subscribe({
      next: (response) => {
        this.logger.success('Success Status', response.status);
        this.logger.info('Response Body', response.body);
        this.standardsResponse = response.body;
      },
      error: (error) => {
        this.logger.error('Request Error Status', error.status);
        this.logger.error('Message', error.message);
      },
      complete: () => {
        this.logger.complete('Request Complete');
      }
    });
  }

  getAllStudents() {
    this.studentManagementService.getAllStudents().subscribe({
      next: (response) => {
        this.logger.success('Success Status', response.status);
        this.logger.info('Response Body', response.body);
        this.studentsResponse = response.body;
        this.pagination = new Pagination(this.studentsResponse, 10);
      },
      error: (error) => {
        this.logger.error('Request Error Status', error.status);
        this.logger.error('Message', error.message);
      },
      complete: () => {
        this.logger.complete('Request Complete');
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
  viewStudentDetails(student: StudentResponse, event: Event): void {
    console.log('Viewing details for Student ID:', student.id);
    event.preventDefault();  // prevents anchor default behavior
    this.router.navigate(ROUTES.STUDENT.DETAILS(student.id.toString()));
  }

  quickFeeAssignment(student: StudentResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing Student ID:', student.id);
    this.router.navigate(ROUTES.STUDENT.STUDENT_FEE_CALCULATOR.DETAILS, {
      queryParams: {
        studentId: student.id,
        academicYearId: student.academicYearId,
        campusId: student.campusId,
        standardId: student.standardId,
        mode: 'edit'
      }
    })
  }


  editStudentDetails(student: StudentResponse, event: Event): void {
    event.preventDefault();  // prevents anchor default behavior
    console.log('Editing Student ID:', student.id);
    this.router.navigate(ROUTES.CAMPUS.SECTION.EDIT(student.id.toString()));
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
    console.log('  Student Search Form Data:', this.studentSearchForm.getRawValue());
    let formValues = this.studentSearchForm.value;
    let params = {
      campusId: formValues.campusId,
      standardId: formValues.standardId,
      keyword: formValues.keyword?.trim() || ''
    };

    this.studentManagementService.searchStudents(params).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.studentsResponse = response.body;
        this.pagination = new Pagination(this.studentsResponse, 10);
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
