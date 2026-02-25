import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { ExamWeightageManagementService } from '../../services/exam-weightage-management.service';
import { ExamWeightageResponse } from '../../models/exam-weightage-response';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { HttpResponse } from '@angular/common/http';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { StandardResponse } from '../../../standard-management/models/standardResponse';

@Component({
    selector: 'app-exam-weightage-listing-table',
    standalone: true,
    imports: [CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule
    ],
    templateUrl: './exam-weightage-listing-table.component.html',
    styleUrls: ['./exam-weightage-listing-table.component.css']
})
export class ExamWeightageListingTableComponent implements OnInit, OnDestroy {
    pagination: Pagination<ExamWeightageResponse> = new Pagination([], 10);
    searchControl = new FormControl('');
    weightages: ExamWeightageResponse[] = [];

    // Cascading selection state
    academicYears: any[] = [];
    campuses: CampusResponse[] = [];
    standards: StandardResponse[] = [];

    selectedYearId: number | null = null;
    selectedCampusId: number | null = null;
    selectedStandardId: number | null = null;

    isLoading = false;

    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private service: ExamWeightageManagementService,
        private yearService: AcademicYearManagementService,
        private campusService: CampusManagementService,
        private standardService: StandardManagementService
    ) { }

    columns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'subjectName', label: 'Subject', sortable: true },
        { key: 'examTermName', label: 'Exam Term', sortable: true },
        { key: 'weightPercentage', label: 'Weightage (%)', sortable: true },
        { key: 'active', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ];

    ngOnInit() {
        this.loadInitialData();
        this.subscribeToSearch();
    }

    private loadInitialData() {
        // Load Academic Years
        this.yearService.getAcademicYears().pipe(takeUntil(this.destroy$)).subscribe((resp: HttpResponse<any>) => {
            this.academicYears = resp.body || [];
            if (this.academicYears.length > 0) {
                const current = this.academicYears.find(y => y.isCurrent || y.active);
                this.selectedYearId = current ? current.id : this.academicYears[0].id;
            }
        });

        // Load Campuses
        this.campusService.getAllCampuses().pipe(takeUntil(this.destroy$)).subscribe((resp: HttpResponse<any>) => {
            this.campuses = resp.body || [];
        });
    }

    onCampusChange(campusId: any) {
        this.selectedCampusId = campusId ? +campusId : null;
        this.standards = [];
        this.selectedStandardId = null;
        this.weightages = [];
        this.pagination = new Pagination([], this.pagination.pageSize);

        if (this.selectedCampusId) {
            this.standardService.getStandardsByCampusId(this.selectedCampusId.toString())
                .pipe(takeUntil(this.destroy$))
                .subscribe((resp: HttpResponse<any>) => {
                    this.standards = resp.body || [];
                });
        }
    }

    onStandardChange(standardId: any) {
        this.selectedStandardId = standardId ? +standardId : null;
        if (this.selectedStandardId && this.selectedYearId) {
            this.getWeightages();
        } else {
            this.weightages = [];
            this.pagination = new Pagination([], this.pagination.pageSize);
        }
    }

    private subscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(search => {
                this.applyLocalFilter(search);
            });
    }

    private applyLocalFilter(searchTerm: string | null) {
        if (!searchTerm) {
            this.pagination = new Pagination(this.weightages, this.pagination.pageSize);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = this.weightages.filter(item =>
            item.subjectName.toLowerCase().includes(term) ||
            item.examTermName.toLowerCase().includes(term) ||
            item.weightPercentage.toString().includes(term)
        );
        this.pagination = new Pagination(filtered, this.pagination.pageSize);
    }

    private getWeightages() {
        if (!this.selectedStandardId || !this.selectedYearId) return;

        this.isLoading = true;
        this.service.getWeightagesByStandard(this.selectedStandardId, this.selectedYearId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp: HttpResponse<any>) => {
                    this.weightages = resp.body || [];
                    this.pagination = new Pagination(this.weightages, this.pagination.pageSize);
                    this.isLoading = false;
                },
                error: () => {
                    this.isLoading = false;
                    this.weightages = [];
                    this.pagination = new Pagination([], this.pagination.pageSize);
                }
            });
    }

    viewDetails(item: ExamWeightageResponse, event: Event): void {
        event.preventDefault();
        this.router.navigate(['/exam-weightage-management/details', item.id]);
    }

    editDetails(item: ExamWeightageResponse, event: Event): void {
        event.preventDefault();
        this.router.navigate(['/exam-weightage-management/edit', item.id]);
    }

    onPageSizeChange(event: any) {
        const newSize = +event.target.value;
        this.pagination.changePageSize(newSize);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
