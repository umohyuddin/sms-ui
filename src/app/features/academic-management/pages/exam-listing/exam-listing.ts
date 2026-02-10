import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject as RxSubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AcademicManagementService } from '../../services/academic-management.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { Pagination } from '../../../../core/pagar/pagination';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';

@Component({
    selector: 'app-exam-listing',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './exam-listing.html'
})
export class ExamListingPage implements OnInit, OnDestroy {
    texts = PageTexts.academic.exams;
    exams: any[] = [];
    sections: any[] = [];
    filters = { standardId: 1, sectionId: '', academicYearId: 1 };

    pagination: Pagination<any> = new Pagination([], 10);
    searchControl = new FormControl('');
    columns = [
        { key: 'name', label: 'Exam Name' },
        { key: 'type', label: 'Type' },
        { key: 'start', label: 'Start Date' },
        { key: 'end', label: 'End Date' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
    ];

    private destroy$ = new RxSubject<void>();

    constructor(private academicService: AcademicManagementService, private router: Router) { }

    ngOnInit(): void {
        // Load sections logic would go here
        this.subscribeToSearch();
    }

    private subscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe(search => {
                const filtered = this.exams.filter(e =>
                    e.examName?.toLowerCase().includes(search?.toLowerCase() || '')
                );
                this.pagination = new Pagination(filtered, this.pagination.pageSize);
            });
    }

    loadExams() {
        if (!this.filters.sectionId) return;
        this.academicService.getExamsBySection(this.filters.standardId, this.filters.sectionId, this.filters.academicYearId).subscribe(resp => {
            this.exams = resp.body || [];
            this.pagination = new Pagination(this.exams, this.pagination.pageSize);
        });
    }

    onPageSizeChange(event: any) {
        this.pagination.changePageSize(+event.target.value);
    }

    goToCreateExam() {
        this.router.navigate(ROUTES.ACADEMIC.EXAMS.SCHEDULE);
    }

    editExam(exam: any, event: Event) {
        // Navigate to edit
    }

    viewSchedule(exam: any, event: Event) {
        this.router.navigate(ROUTES.ACADEMIC.EXAMS.SCHEDULE, { queryParams: { examId: exam.id } });
    }

    deleteExam(id: number, event: Event) {
        if (confirm('Delete this exam?')) {
            // delete logic
        }
    }

    getStatusClass(status: string) {
        switch (status) {
            case 'PUBLISHED': return 'kt-badge--success';
            case 'DRAFT': return 'kt-badge--warning';
            case 'ONGOING': return 'kt-badge--brand';
            default: return 'kt-badge--info';
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
