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
import { ExamTypeManagementService } from '../../../exam-type-management/services/exam-type-management.service';
import { EmployeeManagementService } from '../../../employee-management/services/employee-management.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-exam-subject-create-form',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, CommonModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule],
    templateUrl: './exam-subject-create-form.component.html',
    styleUrls: ['./exam-subject-create-form.component.css']
})
export class ExamSubjectCreateFormComponent implements OnInit {
    examSubjectForm!: FormGroup;
    commonValuesForm!: FormGroup;
    isEditMode = false;
    subjectScheduleId: string | null = null;

    evaluatorSearchControl = new FormControl('');
    filteredEmployees$!: Observable<any[]>;

    // Dropdown data (loaded from APIs)
    examTerms: any[] = [];
    examTypes: any[] = [];
    campuses: any[] = [];
    standards: any[] = [];
    employees: any[] = [];

    // Derived from exams after all 4 filters are selected
    sections: any[] = [];
    allExams: any[] = [];

    currentAcademicYearId: string | number | null = null;

    // Raw subjects from API
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
        private academicYearService: AcademicYearManagementService,
        private examTypeService: ExamTypeManagementService,
        private employeeService: EmployeeManagementService
    ) { }

    ngOnInit(): void {
        this.subjectScheduleId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.subjectScheduleId;

        this.initializeForm();
        this.loadInitialData();
    }

    private initializeForm(): void {
        this.examSubjectForm = this.fb.group({
            examTermId: ['', Validators.required],
            examTypeId: ['', Validators.required],
            campusId: ['', Validators.required],
            standardId: ['', Validators.required]
        });

        this.commonValuesForm = this.fb.group({
            examDate: [''],
            startTime: [''],
            endTime: [''],
            maxMarks: [''],
            minPassMarks: [''],
            evaluatorId: [''],
            room: ['']
        });
    }

    private loadInitialData(): void {
        // Load campuses from API
        this.campusService.getAllCampuses().subscribe({
            next: (resp: HttpResponse<any[]>) => {
                this.campuses = resp.body || [];
            },
            error: (err: HttpErrorResponse) => console.error('Error loading campuses:', err)
        });

        // Load current academic year → exam terms
        this.academicYearService.getCurrentAcademicYear().subscribe({
            next: (resp: HttpResponse<any>) => {
                this.currentAcademicYearId = resp.body?.id || null;
                if (this.currentAcademicYearId) {
                    this.loadExamTerms(this.currentAcademicYearId);
                }
            },
            error: (err: HttpErrorResponse) => console.error('Error loading current academic year:', err)
        });

        // Load exam types from API
        this.examTypeService.getExamTypes().subscribe({
            next: (resp: any) => {
                this.examTypes = resp.body || [];
            },
            error: (err: HttpErrorResponse) => console.error('Error loading exam types:', err)
        });

        // Load employees for evaluator dropdown
        this.employeeService.getAllEmployee().subscribe({
            next: (resp: HttpResponse<any[]>) => {
                this.employees = resp.body || [];
            },
            error: (err: HttpErrorResponse) => console.error('Error loading employees:', err)
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

    private setupEvaluatorAutocomplete(): void {
        this.filteredEmployees$ = this.evaluatorSearchControl.valueChanges.pipe(
            startWith(''),
            map((value: any) => {
                const name = typeof value === 'string' ? value : value?.fullName;
                return name ? this._filterEmployees(name) : this.employees.slice();
            })
        );
    }

    private _filterEmployees(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.employees.filter((emp: any) =>
            emp.fullName?.toLowerCase().includes(filterValue) ||
            emp.employeeNo?.toLowerCase().includes(filterValue)
        );
    }

    displayFn(emp: any): string {
        return emp && emp.fullName ? emp.fullName : '';
    }

    onEvaluatorSelected(event: any): void {
        const emp = event.option.value;
        this.commonValuesForm.patchValue({ evaluatorId: emp.id });
    }

    onGridEvaluatorChange(row: any): void {
        const emp = this.employees.find((e: any) => e.fullName === row.evaluatorName);
        if (emp) {
            row.evaluatorId = emp.id;
        } else {
            row.evaluatorId = null;
        }
    }

    // ── Change handlers ──

    onExamTermChange(): void {
        this.tryLoadExams();
    }

    onExamTypeChange(): void {
        this.tryLoadExams();
    }

    onCampusChange(): void {
        // Campus → load standards from API
        const campusId = this.examSubjectForm.get('campusId')?.value;
        this.standards = [];
        this.sections = [];
        this.allExams = [];
        this.rawSubjects = [];
        this.gridRows = [];
        this.examSubjectForm.patchValue({ standardId: '' }, { emitEvent: false });

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
        this.allExams = [];
        this.rawSubjects = [];
        this.gridRows = [];

        if (standardId) {
            // Load sections from API
            this.standardService.getSectionsByStandardId(standardId).subscribe({
                next: (resp: HttpResponse<any[]>) => {
                    this.sections = (resp.body || []).map(sec => ({
                        ...sec,
                        selected: false
                    }));
                },
                error: (err: HttpErrorResponse) => console.error('Error loading sections:', err)
            });

            // Load subjects for this standard
            if (this.currentAcademicYearId) {
                this.service.getStandardSubjects(standardId, this.currentAcademicYearId).subscribe({
                    next: (resp: HttpResponse<any[]>) => {
                        this.rawSubjects = resp.body || [];
                    },
                    error: (err: HttpErrorResponse) => console.error('Error loading subjects:', err)
                });
            }

            // Load exams for examId mapping
            this.tryLoadExams();
        }
    }

    // ── Load exams when all 4 filters are selected ──

    private tryLoadExams(): void {
        const examTermId = this.examSubjectForm.get('examTermId')?.value;
        const examTypeId = this.examSubjectForm.get('examTypeId')?.value;
        const campusId = this.examSubjectForm.get('campusId')?.value;
        const standardId = this.examSubjectForm.get('standardId')?.value;

        this.allExams = [];

        if (examTermId && examTypeId && campusId && standardId) {
            const params: any = {
                examTermId,
                examTypeId,
                campusId,
                standardId
            };
            if (this.currentAcademicYearId) {
                params.academicYearId = this.currentAcademicYearId;
            }

            this.service.searchExams(params).subscribe({
                next: (resp: HttpResponse<any[]>) => {
                    this.allExams = resp.body || [];
                },
                error: (err: HttpErrorResponse) => console.error('Error loading exams:', err)
            });
        }
    }

    // ── Section selection ──

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
     * Matches examId from allExams by sectionId.
     */
    private rebuildGrid(): void {
        const selectedSections = this.sections.filter(s => s.selected);
        const existingMap = new Map<string, any>();

        this.gridRows.forEach(row => {
            existingMap.set(`${row.sectionId}_${row.subjectId}`, row);
        });

        const newRows: any[] = [];
        for (const sec of selectedSections) {
            // Find the matching exam for this section
            const matchingExam = this.allExams.find(e => e.sectionId == sec.id);

            for (const subj of this.rawSubjects) {
                const key = `${sec.id}_${subj.subjectId || subj.id}`;
                const existing = existingMap.get(key);
                if (existing) {
                    newRows.push(existing);
                } else {
                    newRows.push({
                        examId: matchingExam?.id || null,
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
                        evaluatorId: '',
                        evaluatorName: '',
                        room: '',
                        active: true
                    });
                }
            }
        }
        this.gridRows = newRows;
    }

    // ── Batch fill ──

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
                    evaluatorId: common.evaluatorId || r.evaluatorId,
                    evaluatorName: this.employees.find(e => e.id === (common.evaluatorId || r.evaluatorId))?.fullName || '',
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

    // ── Submit ──

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

        // examId is already mapped on each grid row
        const assignments = selectedRows.map(row => ({
            examId: row.examId,
            subjectId: row.subjectId,
            totalMarks: row.maxMarks,
            passingMarks: row.minPassMarks,
            examDate: row.examDate,
            startTime: row.startTime,
            endTime: row.endTime,
            evaluatorId: row.evaluatorId || null,
            room: row.room,
            active: row.active
        }));

        this.service.bulkScheduleSubjects({ assignments }).subscribe({
            next: () => {
                this.router.navigate(ROUTES.EXAM_SUBJECT_MANAGEMENT.LIST);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error saving schedules:', err);
                alert('Failed to save schedules. Please check if matches existing data.');
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
