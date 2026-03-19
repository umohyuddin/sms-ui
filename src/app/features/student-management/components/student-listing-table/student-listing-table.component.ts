import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';

@Component({
  selector: 'app-student-listing-table',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent, ToasterComponent],
  templateUrl: './student-listing-table.component.html',
  styleUrls: ['./student-listing-table.component.css']
})
export class StudentListingTableComponent implements OnInit, OnDestroy {
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  pagination: Pagination<StudentResponse> = new Pagination([], 10);
  studentsResponse: StudentResponse[] = [];
  sectionsResponse: SectionResponse[] = [];
  standardsResponse: StandardResponse[] = [];
  studentSearchForm!: FormGroup;
  private destroy$ = new Subject<void>();
  campusesResponse: any;
  genderClasses = GENDER_CLASSES;
  
  isLoading = false;
  loadingMessage = '';
  viewMode: 'grid' | 'table' = 'table'; 

  private readonly MODULE = 'StudentList';

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
    { key: 'phone', label: 'Contact #', sortable: true },
    { key: 'gender', label: 'Gender', sortable: true },
    { key: 'dob', label: 'DOB', sortable: true },
    { key: 'isActive', label: 'Status', sortable: true },
    { key: 'enrollmentDate', label: 'Enrollment Date', sortable: true },
    { key: 'standardName', label: 'Standard Name', sortable: true },
    { key: 'campusName', label: 'Campus Name', sortable: true },
    { key: 'action', label: 'Action', sortable: false }
  ];

  ngOnInit() {
    this.initializeForm();
    this.getAllStudents();
    this.getCampuses();
    this.onCampusChange();
    this.onStandardChange();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleView(mode: 'grid' | 'table'): void {
    this.viewMode = mode;
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
        this.campusesResponse = response.body;
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, 'Campuses', 'Failed to load', error);
      }
    });
  }

  onCampusChange() {
    this.studentSearchForm.get('campusId')?.valueChanges.subscribe(campusId => {
      this.loadStandardByCampusId(campusId);
    });
  }

  onStandardChange() {
    this.studentSearchForm.get('standardId')?.valueChanges.subscribe(standardId => {
      this.loadSectionByStandardId(standardId);
    });
  }

  loadStandardByCampusId(campusId: any) {
    this.studentSearchForm.patchValue({ standardId: '', sectionId: '' });
    if (!campusId) {
      this.standardsResponse = [];
      this.sectionsResponse = [];
      return;
    }
    this.standardManagementService.getStandardsByCampusId(campusId).subscribe({
      next: (response) => {
        this.standardsResponse = response.body;
      },
      error: (error) => {
         LoggerUtil.error(this.MODULE, 'Standards', 'Failed to load', error);
      }
    });
  }

  loadSectionByStandardId(standardId: any) {
    this.studentSearchForm.get('sectionId')?.setValue('');
    if (!standardId) {
      this.sectionsResponse = [];
      return;
    }
    this.sectionManagementService.getSectionByStandardId(standardId).subscribe({
      next: (response: any) => {
        this.sectionsResponse = response.body;
      },
      error: (error: any) => {
        LoggerUtil.error(this.MODULE, 'Sections', 'Failed to load', error);
      }
    });
  }

  getAllStudents() {
    this.isLoading = true;
    this.loadingMessage = 'Loading Students...';
    this.studentManagementService.getAllStudents().subscribe({
      next: (response) => {
        this.studentsResponse = response.body;
        this.pagination = new Pagination(this.studentsResponse, 10);
        this.isLoading = false;
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, 'List', 'Failed to load', error);
        this.toaster?.show('Failed to load students', 'error');
        this.isLoading = false;
      }
    });
  }

  viewStudentDetails(student: StudentResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.STUDENT.DETAILS(student.id.toString()));
  }

  quickFeeAssignment(student: StudentResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.STUDENT.STUDENT_FEE_CALCULATOR.DETAILS, {
      queryParams: {
        studentId: student.id,
        academicYearId: student.academicYearId,
        campusId: student.campusId,
        standardId: student.standardId,
        mode: 'edit'
      }
    });
  }

  editStudentDetails(student: StudentResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.STUDENT.EDIT(student.id.toString()));
  }

  toggleActive(student: StudentResponse, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isLoading = true;
    this.loadingMessage = 'Updating status...';
    
    setTimeout(() => {
        student.isActive = !student.isActive;
        this.toaster?.show('Status updated successfully', 'success');
        this.isLoading = false;
    }, 500);
  }

  deleteStudent(student: StudentResponse, event: Event): void {
     event.preventDefault();
     event.stopPropagation();
     if(confirm('Are you sure you want to delete this Student?')) {
        this.toaster?.show('Delete not implemented purely in UI code yet', 'info');
     }
  }

  resetForm() {
    this.studentSearchForm.reset({
      campusId: '',
      standardId: '',
      sectionId: '',
      keyword: ''
    });
    this.getAllStudents();
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }

  onSubmitSearch(): void {
    let formValues = this.studentSearchForm.value;
    let params = {
      campusId: formValues.campusId,
      standardId: formValues.standardId,
      keyword: formValues.keyword?.trim() || ''
    };

    this.isLoading = true;
    this.loadingMessage = 'Searching...';
    this.studentManagementService.searchStudents(params).subscribe({
      next: (response) => {
        this.studentsResponse = response.body;
        this.pagination = new Pagination(this.studentsResponse, 10);
        this.isLoading = false;
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, 'Search', 'Failed to search', error);
        this.toaster?.show('Search failed', 'error');
        this.isLoading = false;
      }
    });
  }
}
