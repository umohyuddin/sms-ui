import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from '../../../../core/pagar/pagination';

import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { StudentResponse } from '../../models/StudentResponse';
import { StudentFeeSummaryResponse } from '../../models/FeeSummaryResponse';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { StudentManagementService } from '../../services/student-management.service';
import { AppConfigService } from '../../../../core/services/app-config.service';

@Component({
  selector: 'app-student-collect-fee',
  templateUrl: './student-collect-fee.html',
  styleUrls: ['./student-collect-fee.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class StudentCollectFee {

  createForm!: FormGroup;
  standardData: StandardResponse[] = [];
  campuses: CampusResponse[] = [];
  routedId: string | null = null;
  isEditMode: boolean = false;
  academicYear: AcademicYearResponse | null = null;
  pagination: Pagination<StudentResponse> = new Pagination([], 10);
  studentsResponse: StudentResponse[] = [];
  feeSummary: StudentFeeSummaryResponse | null = null;
  monthlyFeeStatus: MonthlyFeeStatus[] = [];

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

  constructor(
    private fb: FormBuilder,
    private campusManagementService: CampusManagementService,
    private standardManagemenetService: StandardManagementService,
    private studentManagementSerivce: StudentManagementService,
    private configService: AppConfigService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.academicYear = this.configService.getAcademicYear();
    this.getCampuses();
    this.initializeForm();

    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

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

  private getCampuses() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: response => this.campuses = response.body,
      error: err => console.error(err)
    });
  }

  onCampusChange() {
    this.createForm.get('campusId')?.valueChanges.subscribe(campusId => {
      this.createForm.get('standardId')?.setValue('');
      this.loadStandardByCampusId(campusId);
    });
  }

  loadStandardByCampusId(campusId: any) {
    this.standardManagemenetService.getCampusById(campusId).subscribe({
      next: response => this.standardData = response.body,
      error: err => console.error(err)
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

  getFeeDetailstDetails(student: StudentResponse) {
    const params = {
      studentId: student.id,
      academicYearId: this.academicYear?.id
    };

    this.studentManagementSerivce.getStudentFeeSummary(params).subscribe({
      next: response => {
        this.feeSummary = response.body;
        this.monthlyFeeStatus = this.getMonthlyFeeStatus(this.feeSummary!, this.academicYear!);
        console.log('fee display data',this.monthlyFeeStatus)
      },
      error: err => console.error(err)
    });
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }

  // getters
  get campusId() { return this.createForm.get('campusId'); }
  get standardId() { return this.createForm.get('standardId'); }

  // Monthly fee calculation
  getMonthlyFeeStatus(
    summary: StudentFeeSummaryResponse,
    academicYear: AcademicYearResponse
  ): MonthlyFeeStatus[] {
    const monthlyFee = summary.totalAssignedFee / academicYear.totalMonths;
    const start = new Date(academicYear.startDate ?? '');
    const months: string[] = [];

    for (let i = 0; i < academicYear.totalMonths; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      months.push(d.toLocaleString('default', { month: 'long' }));
    }

    const monthlyPayments: Record<string, number> = {};
    summary.studentFeePaymentsList.forEach(p => {
      monthlyPayments[p.paymentMonth] = (monthlyPayments[p.paymentMonth] || 0) + p.amountPaid;
    });

    let cumulativePaid = 0;
    let cumulativeFee = 0;

    return months.map(month => {
      const paid = monthlyPayments[month] || 0;
      cumulativePaid += paid;
      cumulativeFee += monthlyFee;

      let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
      if (paid >= monthlyFee) status = 'Paid';
      else if (paid > 0 && paid < monthlyFee) status = 'Partial';

      return {
        month,
        monthlyFee,
        totalMonthlyFee: cumulativeFee,
        paid,
        totalPaidSoFar: cumulativePaid,
        status
      };
    });
  }

}

export interface MonthlyFeeStatus {
  month: string;
  monthlyFee: number;
  totalMonthlyFee?: number;
  paid: number;
  totalPaidSoFar?: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
}
