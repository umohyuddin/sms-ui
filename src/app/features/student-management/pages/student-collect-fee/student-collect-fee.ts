import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from '../../../../core/pagar/pagination';
import { LoggerService } from '../../../../core/services/logger.service';

import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { StudentResponse } from '../../models/StudentResponse';

import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { StudentManagementService } from '../../services/student-management.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { StudentFeeSummaryResponse } from '../../models/StudentFeeSummaryResponse';

@Component({
  selector: 'app-student-collect-fee',
  templateUrl: './student-collect-fee.html',
  styleUrls: ['./student-collect-fee.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class StudentCollectFee {
  feeSubmitForm!: FormGroup;
  createForm!: FormGroup;
  standardDD: StandardResponse[] = [];
  campuses: CampusResponse[] = [];
  routedId: string | null = null;
  academicYear: AcademicYearResponse | null = null;
  pagination: Pagination<StudentResponse> = new Pagination([], 10);
  studentsResponse: StudentResponse[] = [];
  feeSummary: StudentFeeSummaryResponse | null = null;
  selectedStudent?: StudentResponse;

  showFeeSummary = false;
  showFeeSubmissionForm = false;


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


  feeTablecolumns = [
    { key: 'month', label: 'Month', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'MonthlyFee', label: 'Monthly Fee', sortable: true },

    { key: 'totalMonthlyFee', label: 'Monthly Fee Commulative', sortable: true },
    { key: 'totalPaid', label: 'Paid (This Month)', sortable: true },
    { key: 'totalPaidSoFar', label: 'Total Paid So Far', sortable: true },
    { key: 'partialPayments', label: 'Partial Payments', sortable: false }
  ];

  constructor(
    private fb: FormBuilder,
    private campusManagementService: CampusManagementService,
    private standardManagemenetService: StandardManagementService,
    private studentManagementSerivce: StudentManagementService,
    private configService: AppConfigService,
    private route: ActivatedRoute,
    private logger: LoggerService) { }

  ngOnInit() {
    this.academicYear = this.configService.getAcademicYear();
    this.getCampuses();
    this.initializeForm();
    this.initializeFeeSubmissionForm();

    this.routedId = this.route.snapshot.paramMap.get('id');

    this.onCampusChange();
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

  resetSearch() {
    this.createForm.get("campusId")?.setValue('');
    this.createForm.get("campusId")?.setValue('');
    this.createForm.get("studentId")?.setValue('');
    this.standardDD = []
    this.studentsResponse = [];

  }

  private initializeFeeSubmissionForm() {
    this.feeSubmitForm = this.fb.group({
      paymentMonth: ['', Validators.required],
      paymentMode: ["Cash"],
      paymentYear: [],
      amountPaid: ['', Validators.required],
      paymentDate: ['', Validators.required]
    });

    this.feeSubmitForm.get('paymentMonth')?.setValue(this.getCurrentMonth());
    this.feeSubmitForm.get('paymentYear')?.setValue(this.getCurrentYear());
    this.feeSubmitForm.get('paymentDate')?.setValue(new Date().toISOString().slice(0, 10));
  }

  private getCampuses() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: response => this.campuses = response.body,
      error: err => this.logger.error('Error loading campuses', err)
    });
  }

  onCampusChange() {
    this.createForm.get('campusId')?.valueChanges.subscribe(campusId => {
      this.createForm.get('standardId')?.setValue('');
      this.loadStandardByCampusId(campusId);
    });
  }

  loadStandardByCampusId(campusId: any) {
    this.standardManagemenetService.getStandardsByCampusId(campusId).subscribe({
      next: response => this.standardDD = response.body,
      error: err => this.logger.error('Error loading standards', err)
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.studentManagementSerivce.searchStudents(this.createForm.getRawValue()).subscribe({
      next: response => {
        this.studentsResponse = response.body;
        this.pagination = new Pagination(this.studentsResponse, 10);
      },
      error: err => console.error(err)
    });
  }

  feeSubmitionForm() {

    const params = {
      academicYearId: this.academicYear?.id,
      studentId: this.feeSummary?.studentId,
      ...this.feeSubmitForm.value
    };
    console.log('  Campus Form Data:', this.feeSubmitForm.getRawValue());
    if (this.feeSubmitForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.feeSubmitForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }
    this.studentManagementSerivce.saveFeePaymente(params).subscribe({
      next: response => {
        console.log("fee payment response", response);

        if (this.selectedStudent) {
          this.getFeeDetailstDetails(this.selectedStudent);
        }
      },
      error: err => console.error(err)
    });
  }
  getFeeDetailstDetails(student: StudentResponse) {
    this.selectedStudent = student;
    const params = {
      studentId: student.id,
      academicYearId: this.academicYear?.id
    };

    this.studentManagementSerivce.getStudentFeeSummary(params).subscribe({
      next: response => {
        this.feeSummary = response.body;
        // Ensure monthlyPayments is always an array
        if (this.feeSummary) {
          if (!this.feeSummary.monthlyPayments) {
            this.feeSummary.monthlyPayments = [];
          }

          // Also ensure partialPayments for each month is defined
          this.feeSummary.monthlyPayments.forEach(month => {
            if (!month.partialPayments) {
              month.partialPayments = [];
            }
          });
        }

        console.log('fee display data', this.feeSummary);
        this.showFeeSummary = true;
        setTimeout(() => {
          document.getElementById('feeSummary')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 200);
      },
      error: err => console.error(err)
    });
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }

  getCurrentMonth(): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return monthNames[new Date().getMonth()];
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  toggleFeeSubmissionForm() {
    this.showFeeSubmissionForm = !this.showFeeSubmissionForm;

    this.feeSubmitForm.get('amountPaid')?.setValue('');

    // Optional smooth scroll when opening
    if (this.showFeeSubmissionForm) {
      setTimeout(() => {
        document.getElementById('feeSubmitForm')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }


  // getters
  get campusId() { return this.createForm.get('campusId'); }
  get standardId() { return this.createForm.get('standardId'); }


}




