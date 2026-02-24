import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { StudentExamMarksManagementService } from '../../services/student-exam-marks-management.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Pagination } from '../../../../core/pagar/pagination';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-student-exam-marks-table',
    templateUrl: './student-exam-marks-table.component.html',
    styleUrls: ['./student-exam-marks-table.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class StudentExamMarksTableComponent implements OnInit, OnDestroy {
    marks: any[] = [];
    allMarks: any[] = []; // Store all marks for local filtering
    isLoading = false;
    pagination: Pagination<any> = new Pagination([], 10);
    searchControl = new FormControl('');
    private destroy$ = new Subject<void>();

    columns = [
        { key: 'studentName', label: 'Student Name' },
        { key: 'rollNumber', label: 'Roll Number' },
        { key: 'obtainedMarks', label: 'Obtained Marks' },
        { key: 'totalMarks', label: 'Total Marks' },
        { key: 'percentage', label: 'Percentage' },
        { key: 'remarks', label: 'Remarks' }
    ];

    constructor(private service: StudentExamMarksManagementService) { }

    ngOnInit(): void {
        this.subscribeToSearch();
    }

    private subscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(search => {
                this.filterMarks(search || '');
            });
    }

    private filterMarks(keyword: string) {
        const filtered = this.allMarks.filter(m =>
            m.studentName?.toLowerCase().includes(keyword.toLowerCase()) ||
            m.rollNumber?.toLowerCase().includes(keyword.toLowerCase())
        );
        this.pagination = new Pagination(filtered, this.pagination.pageSize);
    }

    loadMarksBySubject(subjectId: string | number): void {
        this.isLoading = true;
        this.service.getMarksBySubject(subjectId).subscribe({
            next: (resp: HttpResponse<any[]>) => {
                this.allMarks = resp.body || [];
                this.filterMarks(this.searchControl.value || '');
                this.isLoading = false;
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading marks:', err);
                this.isLoading = false;
            }
        });
    }

    onPageSizeChange(event: any) {
        const newSize = +event.target.value;
        this.pagination.changePageSize(newSize);
    }

    ngOnDestroy(): void {
        this.destroy$?.next();
        this.destroy$?.complete();
    }
}
