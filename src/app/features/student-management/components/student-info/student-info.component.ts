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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { StudentDocumentResponse } from '../../models/StudentDocumentResponse';
@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule
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
  activeTab: string = 'overview';
  currentAcademicYear?: AcademicYearResponse;
  feeSummary?: StudentFeeSummaryResponse;
  studentDiscounts: StudentDiscountAssignmentResponse[] = [];
  studentAssignedFee: StudentFeeAssignmentFlatDTO[] = [];


  constructor(
    private fb: FormBuilder,
    private studentManagementService: StudentManagementService,
    private academicYearService: AcademicYearManagementService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log(`🧑‍🎓 Student ID from route: ${this.studentId}`);
    this.getStudentDetails(this.studentId);
    this.docsInitializeForm();
    this.getCurrentAcademicYear();
    this.docsLookUpData()
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
    if (tab === 'documents') {
      this.getStudentAllDocs();
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



  private docsInitializeForm() {
    this.docsForm = this.fb.group({
      docKey: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  onDocsSubmit() {
    if (this.docsForm.invalid) {
      this.docsForm.markAllAsTouched();
      return;
    }

    if (!this.selectedFile) {
      this.docsForm.get('file')?.setErrors({ required: true });
      return;
    }
    const formData = new FormData();
    formData.append('docKey', this.docsForm.value.docKey);
    formData.append('file', this.selectedFile);
    formData.append('studentId', this.studentId);

    console.log('Form submitted:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    this.studentManagementService.uploadStudentDocs(formData).subscribe({
      next: (response) => {
        console.log('✅ Status:', response.status);
        console.log('📦 Body:', response.body);

        // This is upload response, NOT full employee
        // if (this.employeeData) {
        //   this.employeeData.profilePicture = response.body.filePath;
        // }
         this.onDocsCancel();
        this.getStudentAllDocs();
      },
      error: (error) => {
        console.error('❌ Error:', error);
      }
    });

  }

  groupByDocumentType(docs: StudentDocumentResponse[]) {
    return docs.reduce((acc: any, doc) => {
      const key = doc.documentType;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(doc);
      return acc;
    }, {});
  }

  getStudentAllDocs() {
    this.studentManagementService.getStudentDocs(this.studentId).subscribe({
      next: (response) => {
        console.log('✅ Status:', response.status);
        console.log('📦 Body:', response.body);
        const docs: StudentDocumentResponse[] = response.body;
        this.documentsByType = this.groupByDocumentType(docs);
        console.log(this.documentsByType);
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

  docsLookUpData() {
    this.studentManagementService.getDocsMeta()
      .subscribe({
        next: (response) => {
          console.log('  Request Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.docsTypeDD = Object.entries(response.body.docs).map(
            ([key, label]) => ({ key, label: label as string })
          );
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    const fileControl = this.docsForm.get('file');

    if (file) {
      this.selectedFile = file;
      fileControl?.setValue(file);
    } else {
      this.selectedFile = null;
      fileControl?.setValue(null);
    }

    fileControl?.markAsTouched();   // ✅ REQUIRED
    fileControl?.updateValueAndValidity();
  }
  getFileIcon(fileType: string): string {
    fileType = fileType.toLowerCase();
    switch (fileType) {
      case 'pdf': return './assets/media/files/pdf.svg';
      case 'jpg':
      case 'jpeg': return './assets/media/files/jpg.svg';
      case 'png': return './assets/media/files/png.svg';
      case 'doc':
      case 'docx': return './assets/media/files/doc.svg';
      case 'js': return './assets/media/files/javascript.svg';
      case 'zip': return './assets/media/files/zip.svg';
      default: return './assets/media/icons/svg/Files/File.svg';

    }
  }
  // D:\SMS-UI\sms-ui\src\assets\media\icons\svg\Files\File.svg

  downloadFile(doc: StudentDocumentResponse) {
    this.studentManagementService.downloadStudentDocument(doc.id, this.studentId, doc.fileName);
  }

  onDocsCancel(): void {
    this.docsForm.reset();
    this.docsForm.markAsPristine();
    this.docsForm.markAsUntouched();
    this.selectedFile = null;
  }
  //getters

  get docKey() { return this.docsForm.get('docKey'); }
}
