import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StudentResponse } from '../../models/StudentResponse';
import { StudentManagementService } from '../../services/student-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { StudentFeeSummaryResponse } from '../../models/StudentFeeSummaryResponse';


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

  constructor(
    private studentManagementService: StudentManagementService,
    private academicYearService: AcademicYearManagementService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Student ID from route:', this.studentId);
    this.getStudentDetails(this.studentId);
    this.getCurrentAcademicYear();
  }

  getCurrentAcademicYear() {
    this.academicYearService.getCurrentAcademicYear().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.currentAcademicYear = response.body;
        console.log('📦 Standard data :', this.studentData);
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
        this.getFeeSummary();
        break;
    }
  }
  getFeeSummary() {
    const params = {
      "studentId": this.studentId,
      "academicYearId": this.currentAcademicYear?.id
    }
    this.studentManagementService.getStudentFeeSummary(params).subscribe({

      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.feeSummary = response.body;
        console.log('📦 Standard data :', this.studentData);
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


  getStudentDetails(studentId: string): void {
    this.studentManagementService.getStudentById(studentId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.studentData = response.body;
        console.log('📦 Standard data :', this.studentData);
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
}
