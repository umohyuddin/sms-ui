import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentExamMarksManagementService } from '../../services/student-exam-marks-management.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-student-exam-marks-table',
    templateUrl: './student-exam-marks-table.component.html',
    styleUrls: ['./student-exam-marks-table.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class StudentExamMarksTableComponent implements OnInit {
    marks: any[] = [];
    isLoading = false;

    constructor(private service: StudentExamMarksManagementService) { }

    ngOnInit(): void {
        // For now, it's empty. In a real scenario, we might load some initial data.
    }

    loadMarksBySubject(subjectId: string | number): void {
        this.isLoading = true;
        this.service.getMarksBySubject(subjectId).subscribe({
            next: (resp: HttpResponse<any[]>) => {
                this.marks = resp.body || [];
                this.isLoading = false;
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading marks:', err);
                this.isLoading = false;
            }
        });
    }
}
