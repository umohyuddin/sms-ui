import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmployeeResponse } from '../../models/EmployeeResponse';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { StudentFeeSummaryResponse } from '../../models/StudentFeeSummaryResponse';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-employee-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.css']
})
export class EmployeeInfoComponent {
  docsForm!: FormGroup;
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

  constructor(
    private fb: FormBuilder,
    private employeeManagementService: EmployeeManagementService,
    private academicYearService: AcademicYearManagementService,
    private route: ActivatedRoute,
    private appConfig: AppConfigService
  ) { }

  ngOnInit(): void {
    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('employee ID from route:', this.routedId);
    this.getEmployeeDetails(this.routedId);
    this.getCurrentAcademicYear();
    this.docsInitializeForm()
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
  getCurrentAcademicYear() {
    this.academicYearService.getCurrentAcademicYear().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.currentAcademicYear = response.body;
        console.log('📦 Standard data :', this.employeeData);
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

  setActiveTab(tab: string) {
    this.activeTab = tab;
    switch (tab) {
      case 'feeSummary':
        //this.getFeeSummary();
        break;
      case 'docs':
        this.docsLookUpData();
        break;
    }
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


  getEmployeeDetails(studentId: string): void {
    this.employeeManagementService.getEmployeeById(studentId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.employeeData = response.body;
        this.avatarPreview = this.employeeData?.profilePicture
          ? `${this.appConfig.apiBaseUrl}/${this.employeeData.profilePicture.replace(/\\/g, '/')}`
          : this.avatarPreview;
        console.log('📦 Emplyee GetById Request data :', this.employeeData);
        console.log('📦 Emplyee GetById Request data :', this.avatarPreview);
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

  //getters

  get docsKey() { return this.docsForm.get('docsKey'); }
}
