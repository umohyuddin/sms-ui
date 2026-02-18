import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ExamManagementService } from '../../services/exam-management.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { SectionManagementService } from '../../../section-management/services/section-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { ExamTermManagementService } from '../../../exam-term-management/services/exam-term-management.service';
import { Exam } from '../../models/exam.model';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { Pagination } from '../../../../core/pagar/pagination';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { SectionResponse } from '../../../section-management/models/SectionResponse';

@Component({
    selector: 'app-exam-listing-table',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent, DeletePopupComponent],
    templateUrl: './exam-listing-table.component.html',
    styleUrls: ['./exam-listing-table.component.css']
})
export class ExamListingTableComponent implements OnInit, OnDestroy {
    @ViewChild('toaster') toaster!: ToasterComponent;

    exams: Exam[] = [];
    groupedExams: { [key: string]: Exam[] } = {};
    groupByMode: 'campus' | 'standard' = 'campus';
    loading = false;
    searchControl = new FormControl('');
    pagination: Pagination<Exam> = new Pagination([], 10);

    // Filter Controls
    academicYearControl = new FormControl('');
    campusControl = new FormControl('');
    standardControl = new FormControl('');
    sectionControl = new FormControl('');
    examTermControl = new FormControl('');

    // Data for dropdowns
    academicYears: any[] = [];
    campuses: CampusResponse[] = [];
    standards: StandardResponse[] = [];
    sections: SectionResponse[] = [];
    examTerms: any[] = [];

    isDeletePopupOpen = false;
    pendingDeleteId?: number | string;

    columns = [
        { key: 'name', label: 'Exam Name' },
        { key: 'academicYear', label: 'Academic Year' },
        { key: 'campus', label: 'Campus' },
        { key: 'standard', label: 'Standard' },
        { key: 'section', label: 'Section' },
        { key: 'term', label: 'Exam Term' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
    ];

    private destroy$ = new Subject<void>();

    constructor(
        private examService: ExamManagementService,
        private campusService: CampusManagementService,
        private standardService: StandardManagementService,
        private sectionService: SectionManagementService,
        private academicYearService: AcademicYearManagementService,
        private examTermService: ExamTermManagementService,
        private logger: LoggerService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadInitialData();
        this.getExams();
        this.subscribeToSearch();
        this.subscribeToFilters();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadInitialData() {
        // Load Campuses
        this.campusService.getAllCampuses().subscribe((resp: any) => {
            this.campuses = resp.body || [];
        });

        // Load Academic Years and pre-select current
        this.academicYearService.getAcademicYears().subscribe((resp: any) => {
            this.academicYears = resp.body || [];
            const currentYear = this.academicYears.find(y => y.isCurrent);
            if (currentYear) {
                this.academicYearControl.setValue(currentYear.id);
            }
        });
    }

    private subscribeToFilters() {
        // Campus Change -> Load Standards
        this.campusControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(campusId => {
            this.standards = [];
            this.sections = [];
            this.standardControl.setValue('', { emitEvent: false });
            this.sectionControl.setValue('', { emitEvent: false });
            if (campusId) {
                this.standardService.getStandardsByCampusId(campusId).subscribe((resp: any) => {
                    this.standards = resp.body || [];
                });
            }
            this.getExams();
        });

        // Standard Change -> Load Sections
        this.standardControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(standardId => {
            this.sections = [];
            this.sectionControl.setValue('', { emitEvent: false });
            if (standardId) {
                this.sectionService.getSectionByStandardId(standardId).subscribe((resp: any) => {
                    this.sections = resp.body || [];
                });
            }
            this.getExams();
        });

        // Academic Year Change -> Load Exam Terms
        this.academicYearControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(yearId => {
            this.examTerms = [];
            this.examTermControl.setValue('', { emitEvent: false });
            if (yearId) {
                this.examTermService.getTermsByYear(+yearId).subscribe((resp: any) => {
                    this.examTerms = resp.body || [];
                });
            }
            this.getExams();
        });

        // Other filters
        this.sectionControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.getExams());
        this.examTermControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.getExams());
    }

    private subscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(search => {
                this.getExams();
            });
    }

    getExams() {
        this.loading = true;
        const filters = {
            keyword: this.searchControl.value,
            academicYearId: this.academicYearControl.value,
            campusId: this.campusControl.value,
            standardId: this.standardControl.value,
            sectionId: this.sectionControl.value,
            examTermId: this.examTermControl.value
        };
        this.logger.info('Fetching exams with filters:', filters);

        this.examService.searchExams(filters).subscribe({
            next: (resp) => {
                this.exams = resp.body || [];
                this.groupExams();
                this.pagination = new Pagination(this.exams, this.pagination.pageSize || 10);
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error fetching exams', err);
                this.toaster?.show('Failed to load exams.', 'error');
            }
        });
    }

    private groupExams() {
        this.groupedExams = this.exams.reduce((groups, exam) => {
            const key = this.groupByMode === 'campus'
                ? (exam.campusName || 'Unassigned Campus')
                : (exam.standardName || 'Unassigned Standard');

            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(exam);
            return groups;
        }, {} as { [key: string]: Exam[] });
    }

    changeGroupBy(mode: 'campus' | 'standard') {
        this.groupByMode = mode;
        this.groupExams();
    }

    get groupedKeys() {
        return Object.keys(this.groupedExams).sort();
    }

    onPageSizeChange(event: any) {
        const pageSize = +event.target.value;
        this.pagination.changePageSize(pageSize);
    }

    editExam(id: number) {
        this.router.navigate(['/exams/edit', id]);
    }

    deleteExam(event: Event, id: number) {
        event.stopPropagation();
        this.pendingDeleteId = id;
        this.isDeletePopupOpen = true;
    }

    onConfirmDelete() {
        if (!this.pendingDeleteId) return;

        this.loading = true;
        this.examService.deleteExam(this.pendingDeleteId).subscribe({
            next: () => {
                this.logger.success('Exam deleted successfully');
                this.toaster?.show('Exam deleted successfully.', 'success');
                this.isDeletePopupOpen = false;
                this.pendingDeleteId = undefined;
                this.getExams();
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error deleting exam', err);
                this.toaster?.show('Failed to delete exam.', 'error');
                this.isDeletePopupOpen = false;
            }
        });
    }

    onCancelDelete() {
        this.isDeletePopupOpen = false;
        this.pendingDeleteId = undefined;
    }

    clearFilters() {
        this.searchControl.setValue('', { emitEvent: false });
        this.campusControl.setValue('', { emitEvent: false });
        this.standardControl.setValue('', { emitEvent: false });
        this.sectionControl.setValue('', { emitEvent: false });
        this.examTermControl.setValue('', { emitEvent: false });

        // Reset Academic Year to current if available
        const currentYear = this.academicYears.find(y => y.isCurrent);
        this.academicYearControl.setValue(currentYear ? currentYear.id : '', { emitEvent: false });

        // Reset dependent data arrays
        this.standards = [];
        this.sections = [];
        this.examTerms = [];

        // If current year was selected, reload its terms
        if (currentYear) {
            this.examTermService.getTermsByYear(currentYear.id).subscribe((resp: any) => {
                this.examTerms = resp.body || [];
            });
        }

        this.getExams();
    }
}
