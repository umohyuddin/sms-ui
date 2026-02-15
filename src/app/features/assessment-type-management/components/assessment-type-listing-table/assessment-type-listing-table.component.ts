import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AssessmentTypeManagementService } from '../../services/assessment-type-management.service';
import { AssessmentType } from '../../models/assessment-type.model';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { Pagination } from '../../../../core/pagar/pagination';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';

@Component({
    selector: 'app-assessment-type-listing-table',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent, DeletePopupComponent],
    templateUrl: './assessment-type-listing-table.component.html',
    styleUrls: ['./assessment-type-listing-table.component.css']
})
export class AssessmentTypeListingTableComponent implements OnInit, OnDestroy {
    @ViewChild('toaster') toaster!: ToasterComponent;

    assessmentTypes: AssessmentType[] = [];
    loading = false;
    searchControl = new FormControl('');
    pagination: Pagination<AssessmentType> = new Pagination([], 10);

    isDeletePopupOpen = false;
    pendingDeleteId?: number | string;

    private destroy$ = new Subject<void>();

    constructor(
        private assessmentTypeService: AssessmentTypeManagementService,
        private logger: LoggerService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getAssessmentTypes();
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
                    this.getAssessmentTypes();
                }
            });
    }

    private performSearch(keyword: string) {
        this.loading = true;
        this.assessmentTypeService.searchAssessmentTypes(keyword).subscribe({
            next: (resp) => {
                this.assessmentTypes = resp.body || [];
                this.pagination = new Pagination(this.assessmentTypes, this.pagination.pageSize);
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error searching assessment types', err);
                this.toaster?.show('Failed to search assessment types.', 'error');
            }
        });
    }

    getAssessmentTypes() {
        this.loading = true;
        this.assessmentTypeService.getAssessmentTypes().subscribe({
            next: (resp) => {
                this.assessmentTypes = resp.body || [];
                this.pagination = new Pagination(this.assessmentTypes, 10);
                this.logger.success('Assessment types loaded successfully');
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error fetching assessment types', err);
                this.toaster?.show('Failed to load assessment types.', 'error');
            }
        });
    }

    onPageSizeChange(event: any) {
        const pageSize = +event.target.value;
        this.pagination.changePageSize(pageSize);
    }

    editAssessmentType(id: number) {
        this.router.navigate(ROUTES.ACADEMIC.EXAMS.EDIT_ASSESSMENT_TYPE(id.toString()));
    }

    deleteAssessmentType(event: Event, id: number) {
        event.stopPropagation();
        this.pendingDeleteId = id;
        this.isDeletePopupOpen = true;
    }

    onConfirmDelete() {
        if (!this.pendingDeleteId) return;

        this.loading = true;
        this.assessmentTypeService.deleteAssessmentType(this.pendingDeleteId).subscribe({
            next: () => {
                this.logger.success('Assessment type deleted successfully');
                this.toaster?.show('Assessment type deleted successfully.', 'success');
                this.isDeletePopupOpen = false;
                this.pendingDeleteId = undefined;
                this.getAssessmentTypes();
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error deleting assessment type', err);
                this.toaster?.show('Failed to delete assessment type.', 'error');
                this.isDeletePopupOpen = false;
            }
        });
    }

    onCancelDelete() {
        this.isDeletePopupOpen = false;
        this.pendingDeleteId = undefined;
    }
}
