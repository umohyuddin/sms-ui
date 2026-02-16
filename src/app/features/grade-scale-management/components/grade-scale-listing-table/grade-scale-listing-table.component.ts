import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { GradeScaleManagementService } from '../../services/grade-scale-management.service';
import { GradeScale } from '../../models/grade-scale.model';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { Pagination } from '../../../../core/pagar/pagination';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';

@Component({
    selector: 'app-grade-scale-listing-table',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent, DeletePopupComponent],
    templateUrl: './grade-scale-listing-table.component.html',
    styleUrls: ['./grade-scale-listing-table.component.css']
})
export class GradeScaleListingTableComponent implements OnInit, OnDestroy {
    @ViewChild('toaster') toaster!: ToasterComponent;

    gradeScales: GradeScale[] = [];
    loading = false;
    searchControl = new FormControl('');
    pagination: Pagination<GradeScale> = new Pagination([], 10);

    isDeletePopupOpen = false;
    pendingDeleteId?: number | string;

    columns = [
        { key: 'grade', label: 'Grade' },
        { key: 'minPercentage', label: 'Min %' },
        { key: 'maxPercentage', label: 'Max %' },
        { key: 'active', label: 'Status' },
        { key: 'actions', label: 'Actions' }
    ];

    private destroy$ = new Subject<void>();

    constructor(
        private gradeScaleService: GradeScaleManagementService,
        private logger: LoggerService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getGradeScales();
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
                    this.getGradeScales();
                }
            });
    }

    private performSearch(keyword: string) {
        this.loading = true;
        this.gradeScaleService.searchGradeScales(keyword).subscribe({
            next: (resp) => {
                this.gradeScales = resp.body || [];
                this.pagination = new Pagination(this.gradeScales, this.pagination.pageSize);
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error searching grade scales', err);
                this.toaster?.show('Failed to search grade scales.', 'error');
            }
        });
    }

    getGradeScales() {
        this.loading = true;
        this.gradeScaleService.getGradeScales().subscribe({
            next: (resp) => {
                this.gradeScales = resp.body || [];
                this.pagination = new Pagination(this.gradeScales, 10);
                this.logger.success('Grade scales loaded successfully');
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error fetching grade scales', err);
                this.toaster?.show('Failed to load grade scales.', 'error');
            }
        });
    }

    onPageSizeChange(event: any) {
        const pageSize = +event.target.value;
        this.pagination.changePageSize(pageSize);
    }

    editGradeScale(id: number) {
        this.router.navigate(ROUTES.ACADEMIC.RESULTS.EDIT_GRADE_SCALE(id.toString()));
    }

    deleteGradeScale(event: Event, id: number) {
        event.stopPropagation();
        this.pendingDeleteId = id;
        this.isDeletePopupOpen = true;
    }

    onConfirmDelete() {
        if (!this.pendingDeleteId) return;

        this.loading = true;
        this.gradeScaleService.deleteGradeScale(this.pendingDeleteId).subscribe({
            next: () => {
                this.logger.success('Grade scale deleted successfully');
                this.toaster?.show('Grade scale deleted successfully.', 'success');
                this.isDeletePopupOpen = false;
                this.pendingDeleteId = undefined;
                this.getGradeScales();
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error deleting grade scale', err);
                this.toaster?.show('Failed to delete grade scale.', 'error');
                this.isDeletePopupOpen = false;
            }
        });
    }

    onCancelDelete() {
        this.isDeletePopupOpen = false;
        this.pendingDeleteId = undefined;
    }
}
