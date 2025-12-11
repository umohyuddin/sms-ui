import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { StudentManagementService } from '../../services/student-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { CommonModule } from '@angular/common';
import { Pagination } from '../../../../core/pagar/pagination';
import { StudentResponse } from '../../models/StudentResponse';

@Component({
  selector: 'app-student-collect-fee-create',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './student-collect-fee.html',
  styleUrls: ['./student-collect-fee.css'],
  standalone: true,
})
export class StudentCollectFee {
  createForm!: FormGroup;
  mode = '';
  standardData: StandardResponse[] = [];
  campuses: CampusResponse[] = [];
  routedId: string | null = null;
  isEditMode: boolean = false;
  academicYear: AcademicYearResponse | null = null;
  pagination: Pagination<StudentResponse> = new Pagination([], 10);
  studentsResponse: StudentResponse[] = [];
  constructor(
    private campusManagementService: CampusManagementService,
    private standardManagemenetService: StandardManagementService,
    private studentManagementSerivce: StudentManagementService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private configService: AppConfigService
  ) { }



  ngOnInit() {
    this.academicYear = this.configService.getAcademicYear();
    this.getCampuses();
    this.initializeForm();
    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.routedId);
    } else {
      console.log('Create Mode Activated');
    }
    this.onCampusChange();
  }


  onCampusChange() {
    this.createForm.get('campusId')?.valueChanges.subscribe(campusId => {
      console.log("Campus changed:", campusId);

      const standardCtrl = this.createForm.get('standardId');
      standardCtrl?.setValue('');
      standardCtrl?.markAsUntouched();
      standardCtrl?.markAsPristine();

      // Reset Section dropdown
      const sectionCtrl = this.createForm.get('sectionId');
      sectionCtrl?.setValue('');
      sectionCtrl?.markAsUntouched();
      sectionCtrl?.markAsPristine();

      // Clear Section options
      this.loadStandardByCampusId(campusId);
    });
  }

  loadStandardByCampusId(campusId: any) {
    this.standardManagemenetService.getCampusById(campusId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.standardData = response.body;
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



  private getCampuses() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.campuses = response.body;
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

  private initializeForm() {
    this.createForm = this.fb.group({
      campusId: ['', Validators.required],
      standardId: ['', Validators.required],
      studentId: [''],
      academicYearId: [this.academicYear?.id || '', Validators.required],
      academicYearName: [this.academicYear?.name || '', Validators.required],
    });
  }

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


  onSubmit(): void {
    console.log('✅ Create standard Form Data:', this.createForm.getRawValue());
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }
    this.studentManagementSerivce.searchStudents(this.createForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.studentsResponse = response.body;
        this.pagination = new Pagination(this.studentsResponse, 10);
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


  getFeeDetailstDetails(student: StudentResponse, event: Event) {
    console.log('Viewing details for Student ID:', student.id);
    event.preventDefault();  // prevents anchor default behavior
  }

   onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }
  //getters

  get campusId() { return this.createForm.get('campusId'); }
  get standardId() { return this.createForm.get('standardId'); }
  get sectionId() { return this.createForm.get('sectionId'); }



}


