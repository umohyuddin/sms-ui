import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmployeeResponse } from '../../models/EmployeeResponse';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { StudentFeeSummaryResponse } from '../../models/StudentFeeSummaryResponse';
import { AppConfigService } from '../../../../core/services/app-config.service';


@Component({
  selector: 'app-employee-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.css']
})
export class EmployeeInfoComponent {
  selectedAvatar!: File;
  employeeData?: EmployeeResponse;
  routedId!: string;
  activeTab: string = 'overview';
  currentAcademicYear?: AcademicYearResponse;
  feeSummary?: StudentFeeSummaryResponse;
  avatarPreview: string = './assets/media/users/default.jpg';

  constructor(
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
}
