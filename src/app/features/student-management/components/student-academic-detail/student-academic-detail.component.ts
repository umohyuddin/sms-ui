import { Component, Input } from '@angular/core';
import { StudentResponse } from '../../models/StudentResponse';
import { FormBuilder } from '@angular/forms';
import { StudentManagementService } from '../../services/student-management.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-academic-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-academic-detail.component.html',
  styleUrl: './student-academic-detail.component.css'
})
export class StudentAcademicDetailComponent {
  @Input() studentId!: string;

    showStudentForm: boolean = false;
    studentData?: StudentResponse;
   
    constructor(
      private fb: FormBuilder,
      private studentManagementService: StudentManagementService,
      private router: Router
    ) { }
  
    ngOnInit(): void {
      this.getStudentDetails(this.studentId);
  
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
