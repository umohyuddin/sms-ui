import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StudentResponse } from '../../models/StudentResponse';
import { StudentManagementService } from '../../services/student-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { StudentFeeSummaryResponse } from '../../models/StudentFeeSummaryResponse';
import { StudentFeeAssignmentFlatDTO } from '../../models/StudentFeeAssignmentFlatDTO';
import { StudentDiscountAssignmentResponse } from '../../models/StudentDiscountAssignmentResponse ';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../../../core/services/logger.service';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { StudentDocumentResponse } from '../../models/StudentDocumentResponse';
import { ProfileSideWidgetTabComponent } from '../../../../shared/components/profile-side-widget-tab/profile-side-widget-tab.component';
import { StudentDocumentsComponent } from '../student-documents/student-documents.component';
import { StudentFeeSummaryComponent } from '../student-fee-summary/student-fee-summary.component';
import { StudentProfileDetailComponent } from '../student-profile-detail/student-profile-detail.component';
import { StudentAcademicDetailComponent } from '../student-academic-detail/student-academic-detail.component';
@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProfileSideWidgetTabComponent,StudentAcademicDetailComponent, StudentDocumentsComponent, StudentFeeSummaryComponent, StudentProfileDetailComponent
  ],
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent {

  docsForm!: FormGroup;
  routedId!: string;
  docsTypeDD: KeyValueOption[] = [];
  selectedFile: File | null = null;
  fileInvalid: boolean = false;
  docsData: any;
  documentsByType: { [key: string]: StudentDocumentResponse[] } = {};

  studentData?: StudentResponse;
  studentId!: string;
  activeTab: string = 'personal';
  currentAcademicYear?: AcademicYearResponse;
  feeSummary?: StudentFeeSummaryResponse;
  studentDiscounts: StudentDiscountAssignmentResponse[] = [];
  studentAssignedFee: StudentFeeAssignmentFlatDTO[] = [];


  constructor(
    private fb: FormBuilder,
    private studentManagementService: StudentManagementService,
    private academicYearService: AcademicYearManagementService,
    private route: ActivatedRoute
  , private logger: LoggerService) { }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log(`🧑‍🎓 Student ID from route: ${this.studentId}`);
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


  onStudentDataReceived(data: any) {
    console.log('Received student data from child:', data);
    this.studentData = data; // now you can use it anywhere in parent
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
    // if (tab === 'feeSummary') {
    //   if (this.currentAcademicYear?.id) {
    //     const academicYearId = this.currentAcademicYear.id;
    //     const apiParams = { academicYearId };
    //     this.getFeeSummary();
    //     this.getStudentAssignedDiscount(this.studentId, apiParams);
    //     this.getAssignedStudentFees(this.studentId, academicYearId);
    //   } else {
    //     console.warn('⚠️ Cannot fetch fees: Current Academic Year is undefined.');
    //   }
    // }
    // if (tab === 'documents') {
    //   this.getStudentAllDocs();
    // }
  }




  tabs = [
    {
      key: 'personal',
      label: 'Personal Information',
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
          <g fill="none" stroke="none">
            <polygon points="0 0 24 0 24 24 0 24"></polygon>
            <path d="M12,11 C9.79,11 8,9.21 8,7 C8,4.79 9.79,3 12,3 C14.21,3 16,4.79 16,7 C16,9.21 14.21,11 12,11 Z" fill="#000000" opacity="0.3"></path>
            <path d="M3,20.2 C3.38,15.42 7.26,13 11.98,13 C16.77,13 20.70,15.29 21,20.2 C21,20.39 21,21 20.24,21 C16.54,21 11.03,21 3.72,21 C3.47,21 2.97,20.45 3,20.2 Z" fill="#000000"></path>
          </g>
        </svg>`
    },
    
    {
      key: 'academic_details',
      label: 'Academic Detials',
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect id="bound" x="0" y="0" width="24" height="24"/>
        <path d="M5.5,4 L9.5,4 C10.3284271,4 11,4.67157288 11,5.5 L11,6.5 C11,7.32842712 10.3284271,8 9.5,8 L5.5,8 C4.67157288,8 4,7.32842712 4,6.5 L4,5.5 C4,4.67157288 4.67157288,4 5.5,4 Z M14.5,16 L18.5,16 C19.3284271,16 20,16.6715729 20,17.5 L20,18.5 C20,19.3284271 19.3284271,20 18.5,20 L14.5,20 C13.6715729,20 13,19.3284271 13,18.5 L13,17.5 C13,16.6715729 13.6715729,16 14.5,16 Z" id="Combined-Shape" fill="#000000"/>
        <path d="M5.5,10 L9.5,10 C10.3284271,10 11,10.6715729 11,11.5 L11,18.5 C11,19.3284271 10.3284271,20 9.5,20 L5.5,20 C4.67157288,20 4,19.3284271 4,18.5 L4,11.5 C4,10.6715729 4.67157288,10 5.5,10 Z M14.5,4 L18.5,4 C19.3284271,4 20,4.67157288 20,5.5 L20,12.5 C20,13.3284271 19.3284271,14 18.5,14 L14.5,14 C13.6715729,14 13,13.3284271 13,12.5 L13,5.5 C13,4.67157288 13.6715729,4 14.5,4 Z" id="Combined-Shape" fill="#000000" opacity="0.3"/>
    </g>
</svg>`
    },
    {
      key: 'feeSummary',
      label: 'Fee Summary Current Academic Year',
      iconSvg: `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect id="bound" x="0" y="0" width="24" height="24"/>
        <path d="M10,6 L14.5,6 C16.709139,6 18,7.290861 18,9.5 L18,14 L16,14 L16,9.5 C16,8.3954305 15.6045695,8 14.5,8 L10,8 L10,6 Z M8,6 L8,8 L4,8 C3.44771525,8 3,7.55228475 3,7 C3,6.44771525 3.44771525,6 4,6 L8,6 Z M18,16 L18,20 C18,20.5522847 17.5522847,21 17,21 C16.4477153,21 16,20.5522847 16,20 L16,16 L18,16 Z" id="Combined-Shape" fill="#000000" fill-rule="nonzero" opacity="0.3"/>
        <path d="M7,5 C6.44771525,5 6,4.55228475 6,4 C6,3.44771525 6.44771525,3 7,3 L17.5,3 C19.709139,3 21,4.290861 21,6.5 L21,17 C21,17.5522847 20.5522847,18 20,18 C19.4477153,18 19,17.5522847 19,17 L19,6.5 C19,5.3954305 18.6045695,5 17.5,5 L7,5 Z" id="Path-12-Copy" fill="#000000" fill-rule="nonzero" transform="translate(13.500000, 10.500000) rotate(-180.000000) translate(-13.500000, -10.500000) "/>
    </g>
</svg>`
    },
    {
      key: 'documents',
      label: 'Documents',
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
          <g fill="none" stroke="none">
            <rect x="0" y="0" width="24" height="24"></rect>
            <path d="M3.5,21 L20.5,21 C21.33,21 22,20.33 22,19.5 L22,8.5 C22,7.67 21.33,7 20.5,7 L10,7 L7.44,4.44 C7.15,4.15 6.77,4 6.38,4 L3.5,4 C2.67,4 2,4.67 2,5.5 L2,19.5 C2,20.33 2.67,21 3.5,21 Z" fill="#000000" opacity="0.3"></path>
            <path d="M14.88,12.83 L12.93,12.83 L12.93,10.82 C12.93,10.55 12.71,10.32 12.43,10.32 L11.41,10.32 C11.13,10.32 10.91,10.55 10.91,10.82 L10.91,12.83 L8.95,12.83 C8.67,12.83 8.45,13.05 8.45,13.33 C8.45,13.44 8.49,13.56 8.57,13.65 L11.54,17.16 C11.71,17.37 12.03,17.39 12.24,17.22 L15.27,13.65 C15.44,13.44 15.42,13.13 15.21,12.95 C15.12,12.87 15.01,12.83 14.88,12.83 Z" fill="#000000"></path>
          </g>
        </svg>`
    }
  ];
}
