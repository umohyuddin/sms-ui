import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StudentResponse } from '../../models/StudentResponse';
import { StudentManagementService } from '../../services/student-management.service';


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

  constructor(
    private studentManagementService: StudentManagementService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Student ID from route:', this.studentId);
    this.getStudentDetails(this.studentId);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getStudentDetails(studentId: string): void {
    this.studentManagementService.getStudentById(studentId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
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
