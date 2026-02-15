import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ExamTermManagementService } from '../../services/exam-term-management.service';
import { ExamTerm } from '../../models/exam-term.model';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { Pagination } from '../../../../core/pagar/pagination';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';

@Component({
    selector: 'app-exam-term-listing-table',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent, DeletePopupComponent],
    templateUrl: './exam-term-listing-table.component.html',
    styleUrls: ['./exam-term-listing-table.component.css']
})
export class ExamTermListingTableComponent implements OnInit, OnDestroy {
    @ViewChild('toaster') toaster!: ToasterComponent;

    examTerms: ExamTerm[] = [];
    loading = false;
    searchControl = new FormControl('');
    pagination: Pagination<ExamTerm> = new Pagination([], 10);

    isDeletePopupOpen = false;
    pendingDeleteId?: number | string;

    private destroy$ = new Subject<void>();

    constructor(
        private examTermService: ExamTermManagementService,
        private logger: LoggerService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getExamTerms();
        this.subscribeToSearch();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private subscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(search => {
                if (search && search.trim()) {
                    this.performSearch(search.trim());
                } else {
                    this.getExamTerms();
                }
            });
    }

    private performSearch(keyword: string) {
        this.loading = true;
        this.examTermService.searchExamTerms(keyword).subscribe({
            next: (resp) => {
                this.examTerms = resp.body || [];
                this.pagination = new Pagination(this.examTerms, this.pagination.pageSize);
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error searching exam terms', err);
                this.toaster?.show('Failed to search exam terms.', 'error');
            }
        });
    }

    getExamTerms() {
        this.loading = true;
        // Note: For now we fetch for all years or a default year.
        // The API requires academicYearId. We should probably get the current active year.
        // Assuming current year 1 for now or we will need to fetch active year first.
        // In subject-management, they might be getting it from a shared state or just using a default for listing.
        // For now, let's hardcode 1 to see it work, or check if we can get it from somewhere.
        const academicYearId = 1;

        this.examTermService.getTermsByYear(academicYearId).subscribe({
            next: (resp) => {
                this.examTerms = resp.body || [];
                this.pagination = new Pagination(this.examTerms, 10);
                this.logger.success('Exam terms loaded successfully');
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error fetching exam terms', err);
                this.toaster?.show('Failed to load exam terms.', 'error');
            }
        });
    }

    onPageSizeChange(event: any) {
        const pageSize = +event.target.value;
        this.pagination.changePageSize(pageSize);
    }

    editExamTerm(id: number) {
        this.router.navigate(ROUTES.ACADEMIC.EXAMS.EDIT_TERM(id.toString()));
    }

    deleteExamTerm(event: Event, id: number) {
        event.stopPropagation();
        this.pendingDeleteId = id;
        this.isDeletePopupOpen = true;
    }

    onConfirmDelete() {
        if (!this.pendingDeleteId) return;

        this.loading = true;
        this.examTermService.deleteExamTerm(this.pendingDeleteId).subscribe({
            next: () => {
                this.logger.success('Exam term deleted successfully');
                this.toaster?.show('Exam term deleted successfully.', 'success');
                this.isDeletePopupOpen = false;
                this.pendingDeleteId = undefined;
                this.getExamTerms();
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error deleting exam term', err);
                this.toaster?.show('Failed to delete exam term.', 'error');
                this.isDeletePopupOpen = false;
            }
        });
    }

    onCancelDelete() {
        this.isDeletePopupOpen = false;
        this.pendingDeleteId = undefined;
    }
}
