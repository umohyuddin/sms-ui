import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamSubjectManagementService } from '../../services/exam-subject-management.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';

@Component({
    selector: 'app-exam-subject-create-form',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, CommonModule],
    templateUrl: './exam-subject-create-form.component.html',
    styleUrls: ['./exam-subject-create-form.component.css']
})
export class ExamSubjectCreateFormComponent implements OnInit {
    examSubjectForm!: FormGroup;
    commonValuesForm!: FormGroup;
    isEditMode = false;
    examId: string | null = null;
    subjectScheduleId: string | null = null;
    campuses: any[] = [];
    standards: any[] = [];
    sections: any[] = [];
    examTerms: any[] = [];
    currentAcademicYearId: string | number | null = null;

    // Raw subjects from API (used as source for grid generation)
    private rawSubjects: any[] = [];

    // The grid rows: section × subject cross-product
    gridRows: any[] = [];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private service: ExamSubjectManagementService,
        private campusService: CampusManagementService,
        private standardService: StandardManagementService,
        private academicYearService: AcademicYearManagementService
    ) { }

    ngOnInit(): void {
        this.examId = this.route.snapshot.queryParamMap.get('examId');
        this.subjectScheduleId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.subjectScheduleId;

        this.initializeForm();
        this.loadInitialData();
    }

    private initializeForm(): void {
        this.examSubjectForm = this.fb.group({
            examId: [this.examId, Validators.required],
            examTermId: ['', Validators.required],
            campusId: ['', Validators.required],
            standardId: ['', Validators.required]
        });

        this.commonValuesForm = this.fb.group({
            examDate: [''],
            startTime: [''],
            endTime: [''],
            maxMarks: [''],
            minPassMarks: [''],
            room: ['']
        });
    }

    private loadInitialData(): void {
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
                    this.loadExamTerms(this.currentAcademicYearId);
                }
            },
            error: (err: HttpErrorResponse) => console.error('Error loading current academic year:', err)
        });
    }

    private loadExamTerms(yearId: string | number): void {
        this.service.getExamTermsByTenant(yearId).subscribe({
            next: (resp: HttpResponse<any[]>) => {
                this.examTerms = resp.body || [];
            },
            error: (err: HttpErrorResponse) => console.error('Error loading exam terms:', err)
        });
    }

    onCampusChange(): void {
        const campusId = this.examSubjectForm.get('campusId')?.value;
        this.standards = [];
        this.sections = [];
        this.rawSubjects = [];
        this.gridRows = [];
        this.examSubjectForm.patchValue({ standardId: '' });

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
        const standardId = this.examSubjectForm.get('standardId')?.value;
        this.sections = [];
        this.rawSubjects = [];
        this.gridRows = [];

        if (standardId) {
            this.standardService.getSectionsByStandardId(standardId).subscribe({
                next: (resp: HttpResponse<any[]>) => {
                    this.sections = (resp.body || []).map(sec => ({
                        ...sec,
                        selected: false
                    }));
                },
                error: (err: HttpErrorResponse) => console.error('Error loading sections:', err)
            });

            if (this.currentAcademicYearId) {
                this.service.getStandardSubjects(standardId, this.currentAcademicYearId).subscribe({
                    next: (resp: HttpResponse<any[]>) => {
                        this.rawSubjects = resp.body || [];
                        this.rebuildGrid();
                    },
                    error: (err: HttpErrorResponse) => console.error('Error loading subjects:', err)
                });
            }
        }
    }

    toggleAllSections(event: any): void {
        const checked = event.target.checked;
        this.sections.forEach(s => s.selected = checked);
        this.rebuildGrid();
    }

    onSectionToggle(): void {
        this.rebuildGrid();
    }

    getSelectedSectionCount(): number {
        return this.sections.filter(s => s.selected).length;
    }

    /**
     * Rebuilds the grid as a cross-product of selected sections × subjects.
     * Preserves existing row data if the section+subject combination already exists.
     */
    private rebuildGrid(): void {
        const selectedSections = this.sections.filter(s => s.selected);
        const existingMap = new Map<string, any>();

        // Index existing rows by sectionId_subjectId to preserve user's edits
        this.gridRows.forEach(row => {
            existingMap.set(`${row.sectionId}_${row.subjectId}`, row);
        });

        const newRows: any[] = [];
        for (const sec of selectedSections) {
            for (const subj of this.rawSubjects) {
                const key = `${sec.id}_${subj.subjectId || subj.id}`;
                const existing = existingMap.get(key);
                if (existing) {
                    newRows.push(existing);
                } else {
                    newRows.push({
                        sectionId: sec.id,
                        sectionName: sec.sectionName,
                        subjectId: subj.subjectId || subj.id,
                        subjectName: subj.subjectName || subj.name,
                        subjectCode: subj.subjectCode || subj.code,
                        selected: false,
                        examDate: '',
                        startTime: '',
                        endTime: '',
                        maxMarks: '',
                        minPassMarks: '',
                        room: '',
                        active: true
                    });
                }
            }
        }
        this.gridRows = newRows;
    }

    applyCommonValues(): void {
        const selectedCount = this.gridRows.filter(r => r.selected).length;
        if (selectedCount === 0) {
            alert('Please select at least one row checkbox in the grid first.');
            return;
        }

        const common = this.commonValuesForm.value;
        this.gridRows = this.gridRows.map(r => {
            if (r.selected) {
                return {
                    ...r,
                    examDate: common.examDate || r.examDate,
                    startTime: common.startTime || r.startTime,
                    endTime: common.endTime || r.endTime,
                    maxMarks: common.maxMarks || r.maxMarks,
                    minPassMarks: common.minPassMarks || r.minPassMarks,
                    room: common.room || r.room
                };
            }
            return r;
        });
    }

    toggleAllRows(event: any): void {
        const checked = event.target.checked;
        this.gridRows.forEach(r => r.selected = checked);
    }

    onSubmit(): void {
        if (this.examSubjectForm.invalid) {
            this.examSubjectForm.markAllAsTouched();
            return;
        }

        const selectedRows = this.gridRows.filter(r => r.selected);
        if (selectedRows.length === 0) {
            alert('Please select at least one row to schedule.');
            return;
        }

        const invalid = selectedRows.some(r => !r.examDate || !r.startTime || !r.endTime || !r.maxMarks || !r.minPassMarks);
        if (invalid) {
            alert('Please fill all required fields (Date, Time, Marks) for selected rows.');
            return;
        }

        // Fetch exams to resolve sectionId → examId mapping
        const formValue = this.examSubjectForm.getRawValue();
        const searchParams: any = {
            academicYearId: this.currentAcademicYearId?.toString(),
            standardId: formValue.standardId,
            examTermId: formValue.examTermId
        };
        const campusId = formValue.campusId;
        if (campusId) searchParams.campusId = campusId;

        this.service.searchExams(searchParams).subscribe({
            next: (resp: HttpResponse<any[]>) => {
                const exams = resp.body || [];
                const assignments: any[] = [];

                for (const row of selectedRows) {
                    const exam = exams.find((e: any) => e.sectionId == row.sectionId || e.section?.id == row.sectionId);
                    if (!exam) {
                        alert(`No exam found for section "${row.sectionName}". Please create the exam first.`);
                        return;
                    }

                    assignments.push({
                        examId: exam.id,
                        subjectId: row.subjectId,
                        totalMarks: row.maxMarks,
                        passingMarks: row.minPassMarks,
                        examDate: row.examDate,
                        startTime: row.startTime,
                        endTime: row.endTime,
                        room: row.room,
                        active: row.active
                    });
                }

                this.service.bulkScheduleSubjects({ assignments }).subscribe({
                    next: () => {
                        this.router.navigate(ROUTES.EXAM_SUBJECT_MANAGEMENT.LIST);
                    },
                    error: (err: HttpErrorResponse) => {
                        console.error('Error saving schedules:', err);
                        alert('Failed to save schedules. Please check if matches existing data.');
                    }
                });
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error searching exams:', err);
                alert('Failed to find exams for selected sections.');
            }
        });
    }

    cancel(): void {
        this.router.navigate(ROUTES.EXAM_SUBJECT_MANAGEMENT.LIST);
    }

    getErrorMessage(controlName: string): string {
        const control = this.examSubjectForm.get(controlName);
        if (control?.hasError('required')) return 'This field is required.';
        return '';
    }
}
