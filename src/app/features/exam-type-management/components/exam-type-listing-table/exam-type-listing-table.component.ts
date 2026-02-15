import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject as RxSubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { ExamTypeManagementService } from '../../services/exam-type-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { ExamType } from '../../models/exam-type.model';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';

@Component({
    selector: 'app-exam-type-listing-table',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ToasterComponent, LoaderComponent, DeletePopupComponent],
    templateUrl: './exam-type-listing-table.component.html',
    styleUrls: ['./exam-type-listing-table.component.css']
})
export class ExamTypeListingTableComponent implements OnInit, OnDestroy {
    @ViewChild('toaster') toaster!: ToasterComponent;
    pagination: Pagination<ExamType> = new Pagination([], 10);
    searchControl = new FormControl('');
    examTypes: ExamType[] = [];
    loading = false;
    isDeletePopupOpen = false;
    pendingDeleteId?: number;

    columns = [
        { key: 'name', label: 'Exam Name' },
        { key: 'code', label: 'Code' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
    ];

    private destroy$ = new RxSubject<void>();

    constructor(
        private router: Router,
        private examTypeService: ExamTypeManagementService,
        private logger: LoggerService
    ) { }

    ngOnInit() {
        this.logger.group('ExamTypeListingTableComponent');
        this.getExamTypes();
        this.subscribeToSearch();
        this.logger.groupEnd();
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
                    this.getExamTypes();
                }
            });
    }

    private performSearch(keyword: string) {
        this.loading = true;
        this.examTypeService.searchExamTypes(keyword).subscribe({
            next: (resp) => {
                this.examTypes = resp.body || [];
                this.pagination = new Pagination(this.examTypes, this.pagination.pageSize);
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error searching exam types', err);
                this.toaster?.show('Failed to search exam types.', 'error');
            }
        });
    }

    getExamTypes() {
        this.loading = true;
        this.examTypeService.getExamTypes().subscribe({
            next: (resp) => {
                this.examTypes = resp.body || [];
                // Sort by name or ID if needed
                this.pagination = new Pagination(this.examTypes, 10);
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error fetching exam types', err);
                this.toaster?.show('Failed to load exam types.', 'error');
            }
        });
    }

    onPageSizeChange(event: any) {
        this.pagination.changePageSize(+event.target.value);
    }

    editExamType(examType: ExamType, event: Event) {
        event.preventDefault();
        this.router.navigate(ROUTES.ACADEMIC.EXAMS.EDIT_TYPE(examType.id!.toString()));
    }

    deleteExamType(id: number | undefined, event: Event) {
        if (!id) return;
        event.stopPropagation();
        this.pendingDeleteId = id;
        this.isDeletePopupOpen = true;
    }

    onConfirmDelete() {
        if (!this.pendingDeleteId) return;
        this.loading = true;
        this.examTypeService.deleteExamType(this.pendingDeleteId).subscribe({
            next: () => {
                this.toaster?.show('Exam type deleted successfully.', 'success');
                this.isDeletePopupOpen = false;
                this.pendingDeleteId = undefined;
                this.getExamTypes();
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error deleting exam type', err);
                this.toaster?.show('Failed to delete exam type.', 'error');
                this.isDeletePopupOpen = false;
            }
        });
    }

    onCancelDelete() {
        this.isDeletePopupOpen = false;
        this.pendingDeleteId = undefined;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
