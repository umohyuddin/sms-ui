import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicManagementService } from '../../services/academic-management.service';
import { AttendanceRecord } from '../../models/academic.models';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-attendance.html',
  styleUrls: ['./student-attendance.css']
})
export class StudentAttendancePage implements OnInit {
  filters = { standardId: 1, sectionId: '', date: new Date().toISOString().split('T')[0] };
  sections: any[] = [];
  students: any[] = [];
  loading = false;

  constructor(private academicService: AcademicManagementService) { }

  ngOnInit(): void {
    // TODO: Load sections for current user/authorized standards
  }

  loadStudents() {
    if (!this.filters.sectionId) return;
    this.loading = true;
    // Step 1: Load existing attendance
    this.academicService.getSectionAttendance(this.filters.standardId, this.filters.sectionId, this.filters.date).subscribe({
      next: (resp) => {
        const records: AttendanceRecord[] = resp.body || [];
        // Step 2: Load students for section (placeholder logic)
        // In a real app, you'd fetch students and merge with existing records
        this.students = [
          { id: 1, rollNo: '101', fullName: 'John Doe', status: 'PRESENT', remarks: '' },
          { id: 2, rollNo: '102', fullName: 'Jane Smith', status: 'PRESENT', remarks: '' }
        ];
        // Merge labels
        this.students.forEach(s => {
          const rec = records.find(r => r.studentId === s.id);
          if (rec) {
            s.status = rec.status;
            s.remarks = rec.remarks;
          }
        });
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  saveAttendance() {
    this.loading = true;
    const records = this.students.map(s => ({
      studentId: s.id,
      standardId: this.filters.standardId,
      sectionId: +this.filters.sectionId,
      attendanceDate: this.filters.date,
      status: s.status,
      remarks: s.remarks
    }));
    this.academicService.markStudentAttendance(records).subscribe({
      next: () => {
        alert('Attendance saved successfully');
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
