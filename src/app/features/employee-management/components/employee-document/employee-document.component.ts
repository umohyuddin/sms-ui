import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { EmployeeDocumentResponseDto } from '../../models/EmployeeDocumentResponseDto';
import { EmployeeResponse } from '../../models/EmployeeResponse';
import { StudentFeeSummaryResponse } from '../../models/StudentFeeSummaryResponse';
import { EmployeeManagementService } from '../../services/employee-management.service';

@Component({
  selector: 'app-employee-document',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './employee-document.component.html',
  styleUrl: './employee-document.component.css'
})
export class EmployeeDocumentComponent {docsForm!: FormGroup;
  selectedAvatar!: File;
  employeeData?: EmployeeResponse;
  routedId!: string;
  activeTab: string = 'overview';
  currentAcademicYear?: AcademicYearResponse;
  feeSummary?: StudentFeeSummaryResponse;
  avatarPreview: string = './assets/media/users/default.jpg';
  docsTypeDD: { key: string; label: string; }[] = [];
  selectedFile: File | null = null;
  fileInvalid: boolean = false;
  docsData: any;
  documentsByType: { [key: string]: EmployeeDocumentResponseDto[] } = {};
  personalForm!: FormGroup;
  showPersonalForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private employeeManagementService: EmployeeManagementService,
    private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) { }



  ngOnInit(): void {
    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('employee ID from route:', this.routedId);
    this.getEmployeeDetails(this.routedId);
    this.docsInitializeForm()


    this.personalForm = this.fb.group({
      fullName: [''],
      email: [''],
      primaryPhone: [''],
      gender: [''],
      dob: ['']
    });
  }

  togglePersonalForm() {
    this.showPersonalForm = !this.showPersonalForm;
  }

  updatePersonalInfo() {
    if (this.personalForm.valid) {
      console.log(this.personalForm.value);
      // Call API to save data
      this.showPersonalForm = false; // hide form after update
    }
  }
  private docsInitializeForm() {
    this.docsForm = this.fb.group({
      docKey: ['', Validators.required],
      file: [null, Validators.required]
    });
  }



  onDocsSubmit() {
    if (!this.selectedFile) {
      this.fileInvalid = true;
    }

    if (this.docsForm.invalid || !this.selectedFile) {
      this.docsForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('docKey', this.docsForm.value.docKey);
    formData.append('file', this.selectedFile);
    formData.append('employeeId', this.routedId);

    console.log('Form submitted:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    this.employeeManagementService.uploadEmployeeDocs(formData).subscribe({
      next: (response) => {
        console.log('✅ Status:', response.status);
        console.log('📦 Body:', response.body);

        // This is upload response, NOT full employee
        if (this.employeeData) {
          this.employeeData.profilePicture = response.body.filePath;
        }
      },
      error: (error) => {
        console.error('❌ Error:', error);
      }
    });

  }
 

  setActiveTab(tab: string) {
    this.activeTab = tab;
    switch (tab) {
      case 'feeSummary':
        //this.getFeeSummary();
        break;
      case 'docs':
        this.docsLookUpData();
        this.getEmployeeAllDocs()
        break;
    }
  }


  groupByDocumentType(docs: EmployeeDocumentResponseDto[]) {
    return docs.reduce((acc: any, doc) => {
      const key = doc.documentType;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(doc);
      return acc;
    }, {});
  }
  getEmployeeAllDocs() {
    this.employeeManagementService.getEmployeeDocs(this.routedId).subscribe({
      next: (response) => {
        console.log('✅ Status:', response.status);
        console.log('📦 Body:', response.body);
        const docs: EmployeeDocumentResponseDto[] = response.body;
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
  // getFeeSummary() {
  //   const params = {
  //     "studentId": this.routedId,
  //     "academicYearId": this.currentAcademicYear?.id
  //   }
  //   this.studentManagementService.getStudentFeeSummary(params).subscribe({

  //     next: (response) => {
  //       console.log('  Success Status:', response.status);
  //       console.log('📦 Response Body:', response.body);
  //       this.feeSummary = response.body;
  //       console.log('📦 Standard data :', this.employeeData);
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


  getEmployeeDetails(id: string): void {
    console.group(`Fetching Employee Details - ID: ${id}`);
    this.employeeManagementService.getEmployeeById(id).subscribe({
      next: (response) => {
        console.log('%c✅ Request Successful', 'color: green; font-weight: bold;');
        console.log('Employee Response:', { status: response.status, data: response.body });
        this.employeeData = response.body;

        if (this.employeeData?.profilePicture) {
          this.avatarPreview = `${this.appConfig.apiBaseUrl}/${this.employeeData.profilePicture.replace(/\\/g, '/')}`;
          console.log('Avatar Preview URL:', this.avatarPreview);
        } else {
          console.warn('⚠️ No profile picture found, using default avatar.');
        }
      },
      error: (error) => {
        console.error('%c❌ Request Failed', 'color: red; font-weight: bold;');
        console.error('Employee Request Error:', { status: error.status, message: error.message });
      },
      complete: () => {
        console.log('%c🔚 Request Complete', 'color: blue; font-weight: bold;');
        console.groupEnd();
      }
    });
  }

  uploadAvatar() {
    if (!this.selectedAvatar) {
      console.error('No avatar selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedAvatar);
    formData.append('employeeId', String(this.routedId));

    this.employeeManagementService.uploadProfilePhoto(formData).subscribe({
      next: (response) => {
        console.log('✅ Status:', response.status);
        console.log('📦 Body:', response.body);

        // This is upload response, NOT full employee
        if (this.employeeData) {
          this.employeeData.profilePicture = response.body.filePath;
        }
      },
      error: (error) => {
        console.error('❌ Error:', error);
      }
    });
  }
  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedAvatar = file;

    // Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


  docsLookUpData() {
    this.employeeManagementService.getDocsMeta()
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.docsForm.patchValue({ file: file });
      this.docsForm.get('file')?.updateValueAndValidity();
      this.selectedFile = file;
    } else {
      this.docsForm.patchValue({ file: null });
    }
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
      default: return './assets/media/files/file.svg';
    }
  }

  downloadFile(doc: any) {
    console.log(doc)
    const url = `${this.appConfig.apiBaseUrl}${API_ENDPOINTS.EMPLOYEE.DOWNLOAD_DOCS}/${doc.id}?employeeId=${this.routedId}`;
    window.open(url, '_blank');
  }



  //getters

  get docsKey() { return this.docsForm.get('docsKey'); }
}
