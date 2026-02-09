import { Component, Input } from '@angular/core';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { StudentFeeSummaryResponse } from '../../models/StudentFeeSummaryResponse';
import { StudentDiscountAssignmentResponse } from '../../models/StudentDiscountAssignmentResponse ';
import { StudentFeeAssignmentFlatDTO } from '../../models/StudentFeeAssignmentFlatDTO';
import { StudentResponse } from '../../models/StudentResponse';
import { FormBuilder } from '@angular/forms';
import { StudentManagementService } from '../../services/student-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../core/services/logger.service';
import { AppConfigService } from '../../../../core/services/app-config.service';

@Component({
  selector: 'app-student-fee-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-fee-summary.component.html',
  styleUrl: './student-fee-summary.component.css'
})
export class StudentFeeSummaryComponent {
   @Input() studentId!: string;
  studentData?: StudentResponse;
  activeTab: string = 'personal';
  currentAcademicYear?: AcademicYearResponse;
  feeSummary?: StudentFeeSummaryResponse;
  studentDiscounts: StudentDiscountAssignmentResponse[] = [];
  studentAssignedFee: StudentFeeAssignmentFlatDTO[] = [];


  constructor(
    private fb: FormBuilder,
    private studentManagementService: StudentManagementService,
    private academicYearService: AcademicYearManagementService,
    private appCofig : AppConfigService,
    private route: ActivatedRoute
  , private logger: LoggerService) { }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log(`🧑‍🎓 Student ID from route: ${this.studentId}`);
       this.loadFeeData();

  }

   private loadFeeData() {
    // Fetch Fee Summary
    this.studentManagementService.getStudentFeeSummary(
      { studentId: this.studentId,
        academicYearId:this.appCofig.getAcademicYear()?.id
       }
    ).subscribe({
      next: (res) => this.feeSummary = res.body,
      error: (err) => console.error('Error fetching fee summary', err)
    });

    // Fetch Assigned Fees
    this.studentManagementService.getAssignedStudentFee(this.studentId, {academicYearId:this.appCofig.getAcademicYear()?.id}).subscribe({
      next: (res) => this.studentAssignedFee = res.body || [],
      error: (err) => console.error('Error fetching assigned fees', err)
    });

    // Fetch Assigned Discounts
    this.studentManagementService.getAssignedStudentDiscounts(this.studentId, {academicYearId:this.appCofig.getAcademicYear()?.id}).subscribe({
      next: (res) => this.studentDiscounts = res.body || [],
      error: (err) => console.error('Error fetching discounts', err)
    });
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


}
