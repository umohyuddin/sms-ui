import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StudentResponse } from '../../models/StudentResponse';
import { StudentManagementService } from '../../services/student-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { StudentFeeSummaryResponse } from '../../models/StudentFeeSummaryResponse';
import { StudentFeeAssignmentFlatDTO } from '../../models/StudentFeeAssignmentFlatDTO';
import { StudentDiscountAssignmentResponse } from '../../models/StudentDiscountAssignmentResponse ';

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent {
  studentData?: StudentResponse;
  studentId!: string;
  activeTab: string = 'overview';
  currentAcademicYear?: AcademicYearResponse;
  feeSummary?: StudentFeeSummaryResponse;
  studentDiscounts: StudentDiscountAssignmentResponse[] = [];
  studentAssignedFee: StudentFeeAssignmentFlatDTO[] = [];

  constructor(
    private studentManagementService: StudentManagementService,
    private academicYearService: AcademicYearManagementService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log(`🧑‍🎓 Student ID from route: ${this.studentId}`);
    this.getStudentDetails(this.studentId);
    this.getCurrentAcademicYear();
  }

STUDENT_FEE_COLUMNS: { field: keyof StudentFeeAssignmentFlatDTO, header: string }[] = [
  { field: 'feeCatalogName', header: 'Fee Catalog' },
  { field: 'feeCatalogCode', header: 'Fee Catalog Code' },
  { field: 'feeComponentName', header: 'Fee Component' },
  { field: 'feeAmount', header: 'Amount (PKR)' },
  { field: 'feeCatalogChargeType', header: 'Charge Type' },
  { field: 'feeCatalogRecurrenceRule', header: 'Recurrence' },
];

STUDENT_DISCOUNT_COLUMNS: { field: keyof StudentDiscountAssignmentResponse, header: string }[] = [
  { field: 'discountTypeName', header: 'Discount Type Name' },
  { field: 'discountSubTypeName', header: 'Discount Sub Type Name' },
  { field: 'isPercentage', header: 'Is Percentage' },
  { field: 'appliedAmount', header: 'Applied Amount' },
  { field: 'appliedPercentage', header: 'Applied Percentage' },
  { field: 'discountValue', header: 'Discount Value' },

];


  getCurrentAcademicYear() {
    this.academicYearService.getCurrentAcademicYear().subscribe({
      next: (response) => {
        this.currentAcademicYear = response.body;
        console.log('📅 Current Academic Year fetched:', this.currentAcademicYear);
      },
      error: (error) => {
        console.error('❌ Failed to fetch current academic year:', error);
      },
      complete: () => console.log('✅ getCurrentAcademicYear completed')
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'feeSummary') {
      if (this.currentAcademicYear?.id) {
        const academicYearId = this.currentAcademicYear.id;
        const apiParams = { academicYearId };
        this.getFeeSummary();
        this.getStudentAssignedDiscount(this.studentId, apiParams);
        this.getAssignedStudentFees(this.studentId, academicYearId);
      } else {
        console.warn('⚠️ Cannot fetch fees: Current Academic Year is undefined.');
      }
    }
  }

  private getStudentAssignedDiscount(studentId: string, apiParams: any) {
    console.log(`📤 Fetching assigned discounts for student: ${studentId}`);
    this.studentManagementService.getAssignedStudentDiscounts(studentId, apiParams).subscribe({
      next: (response) => {
        this.studentDiscounts = response.body || [];
        console.log(`✅ Assigned discounts fetched (${this.studentDiscounts.length} items)`);
      },
      error: (error) => console.error('❌ Error fetching assigned discounts:', error),
      complete: () => console.log('✅ getStudentAssignedDiscount completed')
    });
  }

  getAssignedStudentFees(studentId: string, academicYearId: number) {
    console.log(`📤 Fetching assigned fees for student: ${studentId}, Academic Year ID: ${academicYearId}`);
    const apiParams = { academicYearId };
    this.studentManagementService.getAssignedStudentFee(studentId, apiParams).subscribe({
      next: (response) => {
        this.studentAssignedFee = response.body || [];
        console.log(`✅ Assigned fees fetched (${this.studentAssignedFee.length} items)`);
      },
      error: (error) => console.error('❌ Error fetching assigned fees:', error),
      complete: () => console.log('✅ getAssignedStudentFees completed')
    });
  }

  getFeeSummary() {
    if (!this.currentAcademicYear?.id) {
      console.warn('⚠️ Cannot fetch fee summary: Academic Year ID is undefined');
      return;
    }

    const params = {
      studentId: this.studentId,
      academicYearId: this.currentAcademicYear.id
    };
    console.log(`📤 Fetching fee summary for student: ${this.studentId}`);

    this.studentManagementService.getStudentFeeSummary(params).subscribe({
      next: (response) => {
        this.feeSummary = response.body;
        console.log('✅ Fee summary fetched:', this.feeSummary);
      },
      error: (error) => console.error('❌ Error fetching fee summary:', error),
      complete: () => console.log('✅ getFeeSummary completed')
    });
  }

  getStudentDetails(studentId: string): void {
    console.log(`📤 Fetching student details for ID: ${studentId}`);
    this.studentManagementService.getStudentById(studentId).subscribe({
      next: (response) => {
        this.studentData = response.body;
        console.log('✅ Student details fetched:', this.studentData);
      },
      error: (error) => console.error('❌ Error fetching student details:', error),
      complete: () => console.log('✅ getStudentDetails completed')
    });
  }
}
