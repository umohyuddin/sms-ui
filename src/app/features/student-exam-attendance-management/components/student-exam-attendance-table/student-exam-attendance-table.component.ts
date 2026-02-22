import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentExamAttendanceManagementService } from '../../services/student-exam-attendance-management.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-student-exam-attendance-table',
    templateUrl: './student-exam-attendance-table.component.html',
    styleUrls: ['./student-exam-attendance-table.css'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class StudentExamAttendanceTableComponent implements OnInit {
    records: any[] = [];
    isLoading = false;

    constructor(private service: StudentExamAttendanceManagementService) { }

    ngOnInit(): void { }

    loadAttendanceBySubject(subjectId: string | number): void {
        this.isLoading = true;
        this.service.getAttendanceBySubject(subjectId).subscribe({
            next: (resp: HttpResponse<any[]>) => {
                this.records = resp.body || [];
                this.isLoading = false;
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading attendance:', err);
                this.isLoading = false;
            }
        });
    }
}
