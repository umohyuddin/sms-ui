import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { StudentManagementService } from '../../services/student-management.service';
import { StudentResponse } from '../../models/StudentResponse';
import { StudentInfoComponent } from '../../components/student-info/student-info.component';


@Component({
  selector: 'app-student-details',
  imports: [
    StudentInfoComponent
  ],
  templateUrl: './student-details.html',
  styleUrls: ['./student-details.css'],
  standalone: true,
})
export class StudentDetails {
  studentData?: StudentResponse;
  studentId!: string;


  constructor(private studentManagementService: StudentManagementService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Student ID from route:', this.studentId);
    this.getStudentDetails(this.studentId);
  }

  getStudentDetails(studentId: string): void {
    this.studentManagementService.getStudentById(studentId).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('✅ Status:', response.status);
        console.log('📦 Body:', response.body);
        this.studentData = response.body;
        console.log('standard Details:', this.studentData);
      },
      error: (error) => {
        console.error('❌ Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
      }
    });
  }
}


