import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Pagination } from '../../../../core/pagar/pagination';
import { ExamSubjectManagementService } from '../../services/exam-subject-management.service';
import { ExamSubjectResponse } from '../../models/exam-subject-response';
import { EXAM_SUBJECT_METADATA } from '../../models/exam-subject-metadata';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';

@Component({
    selector: 'app-exam-subject-listing-table',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './exam-subject-listing-table.component.html',
    styleUrls: ['./exam-subject-listing-table.component.css']
})
export class ExamSubjectListingTableComponent implements OnInit, OnDestroy {
    @Input() examId!: string | number;

    texts = PageTexts.examSubject;
    pagination: Pagination<ExamSubjectResponse> = new Pagination([], 10);
    searchControl = new FormControl('');
    examSubjects: ExamSubjectResponse[] = [];
    columns = EXAM_SUBJECT_METADATA.columns;

    private destroy$ = new Subject<void>();

    // Filter dropdowns
    filterForm!: FormGroup;
    campuses: any[] = [];
    standards: any[] = [];
    sections: any[] = [];
    examTerms: any[] = [];
    currentAcademicYearId: string | number | null = null;

    // Show matrix after filters are applied
    showMatrix = false;

    // --- Dummy matrix data ---
    dummyMatrix: any[] = [];

    // Summary stats
    get totalSubjects(): number {
        return this.dummyMatrix.reduce((sum, sec) => sum + sec.subjects.length, 0);
    }
    get scheduledCount(): number {
        return this.dummyMatrix.reduce((sum, sec) => sum + sec.subjects.filter((s: any) => s.status === 'Scheduled').length, 0);
    }
    get pendingCount(): number {
        return this.dummyMatrix.reduce((sum, sec) => sum + sec.subjects.filter((s: any) => s.status === 'Pending').length, 0);
    }
    get notScheduledCount(): number {
        return this.dummyMatrix.reduce((sum, sec) => sum + sec.subjects.filter((s: any) => s.status === 'Not Scheduled').length, 0);
    }

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private service: ExamSubjectManagementService,
        private campusService: CampusManagementService,
        private standardService: StandardManagementService,
        private academicYearService: AcademicYearManagementService
    ) { }

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            examTermId: [''],
            campusId: [''],
            standardId: ['']
        });

        this.loadFilterData();

        if (this.examId) {
            this.loadExamSubjects();
        }
        this.subscribeToSearch();
    }

    private loadFilterData(): void {
        this.campusService.getAllCampuses().subscribe({
            next: (resp: HttpResponse<any[]>) => {
                this.campuses = resp.body || [];
            },
            error: (err: HttpErrorResponse) => console.error('Error loading campuses:', err)
        });

        this.academicYearService.getCurrentAcademicYear().subscribe({
            next: (resp: HttpResponse<any>) => {
                this.currentAcademicYearId = resp.body?.id || null;
                if (this.currentAcademicYearId) {
                    this.service.getExamTermsByTenant(this.currentAcademicYearId).subscribe({
                        next: (resp: HttpResponse<any[]>) => {
                            this.examTerms = resp.body || [];
                        },
                        error: (err: HttpErrorResponse) => console.error('Error loading exam terms:', err)
                    });
                }
            },
            error: (err: HttpErrorResponse) => console.error('Error loading academic year:', err)
        });
    }

    onCampusChange(): void {
        const campusId = this.filterForm.get('campusId')?.value;
        this.standards = [];
        this.sections = [];
        this.filterForm.patchValue({ standardId: '' });
        this.showMatrix = false;
        this.dummyMatrix = [];

        if (campusId) {
            this.standardService.getStandardsByCampusId(campusId).subscribe({
                next: (resp: HttpResponse<any[]>) => {
                    this.standards = resp.body || [];
                },
                error: (err: HttpErrorResponse) => console.error('Error loading standards:', err)
            });
        }
    }

    onStandardChange(): void {
        const standardId = this.filterForm.get('standardId')?.value;
        this.sections = [];
        this.showMatrix = false;
        this.dummyMatrix = [];

        if (standardId) {
            this.standardService.getSectionsByStandardId(standardId).subscribe({
                next: (resp: HttpResponse<any[]>) => {
                    this.sections = resp.body || [];
                    this.loadDummyMatrix();
                },
                error: (err: HttpErrorResponse) => console.error('Error loading sections:', err)
            });
        }
    }

    private loadDummyMatrix(): void {
        const standardId = this.filterForm.get('standardId')?.value;
        const examTermId = this.filterForm.get('examTermId')?.value;

        if (!standardId || !examTermId || this.sections.length === 0) {
            this.showMatrix = false;
            return;
        }

        // Generate dummy data based on sections loaded
        const dummySubjects = [
            { subjectName: 'Mathematics', subjectCode: 'MATH-101' },
            { subjectName: 'English', subjectCode: 'ENG-101' },
            { subjectName: 'Science', subjectCode: 'SCI-101' },
            { subjectName: 'Social Studies', subjectCode: 'SS-101' },
            { subjectName: 'Computer Science', subjectCode: 'CS-101' }
        ];

        const statuses = ['Scheduled', 'Scheduled', 'Scheduled', 'Pending', 'Not Scheduled'];
        const rooms = ['Room 101', 'Room 102', 'Lab 1', 'Room 103', 'Lab 2'];

        this.dummyMatrix = this.sections.map((sec, si) => ({
            sectionName: sec.sectionName,
            sectionId: sec.id,
            subjects: dummySubjects.map((subj, idx) => ({
                subjectName: subj.subjectName,
                subjectCode: subj.subjectCode,
                examDate: statuses[(idx + si) % 5] !== 'Not Scheduled' ? `2026-03-0${idx + 1}` : '',
                startTime: statuses[(idx + si) % 5] !== 'Not Scheduled' ? `0${9 + si}:00` : '',
                endTime: statuses[(idx + si) % 5] !== 'Not Scheduled' ? `${10 + si}:30` : '',
                maxMarks: 100,
                minPassMarks: 33,
                room: statuses[(idx + si) % 5] !== 'Not Scheduled' ? rooms[idx] : '',
                status: statuses[(idx + si) % 5]
            }))
        }));

        this.showMatrix = true;
    }

    clearFilters(): void {
        this.filterForm.reset({ examTermId: '', campusId: '', standardId: '' });
        this.standards = [];
        this.sections = [];
        this.dummyMatrix = [];
        this.showMatrix = false;
    }

    private subscribeToSearch(): void {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(term => {
                const filtered = this.examSubjects.filter(s =>
                    s.subjectName?.toLowerCase().includes(term?.toLowerCase() || '')
                );
                this.pagination = new Pagination(filtered, this.pagination.pageSize);
            });
    }

    private loadExamSubjects(): void {
        this.service.getExamSubjects(this.examId).subscribe({
            next: (response: HttpResponse<ExamSubjectResponse[]>) => {
                this.examSubjects = response.body || [];
                this.pagination = new Pagination(this.examSubjects, 10);
            },
            error: (error: HttpErrorResponse) => {
                console.error('Error loading exam subjects:', error);
            }
        });
    }

    scheduleNewSubject(): void {
        this.router.navigate(ROUTES.EXAM_SUBJECT_MANAGEMENT.CREATE, { queryParams: { examId: this.examId } });
    }

    editSchedule(item: ExamSubjectResponse, event: Event): void {
        event.preventDefault();
        this.router.navigate(ROUTES.EXAM_SUBJECT_MANAGEMENT.EDIT(item.id?.toString() || ''));
    }

    unschedule(id: any, event: Event): void {
        event.stopPropagation();
        if (confirm(this.texts.messages.deleteConfirmation)) {
            this.service.unscheduleExamSubject({ id }).subscribe({
                next: () => {
                    this.loadExamSubjects();
                },
                error: (error: HttpErrorResponse) => {
                    console.error('Error unscheduling subject:', error);
                }
            });
        }
    }

    onPageSizeChange(event: any): void {
        const newSize = +event.target.value;
        this.pagination.changePageSize(newSize);
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Scheduled': return 'badge-success';
            case 'Pending': return 'badge-warning';
            case 'Not Scheduled': return 'badge-danger';
            default: return 'badge-secondary';
        }
    }

    getSelectedTermName(): string {
        const id = this.filterForm.get('examTermId')?.value;
        return this.examTerms.find(t => t.id == id)?.name || '';
    }

    getSelectedCampusName(): string {
        const id = this.filterForm.get('campusId')?.value;
        return this.campuses.find(c => c.id == id)?.campusName || '';
    }

    getSelectedStandardName(): string {
        const id = this.filterForm.get('standardId')?.value;
        return this.standards.find(s => s.id == id)?.standardName || '';
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
