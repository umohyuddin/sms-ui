import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ExamManagementService } from '../../services/exam-management.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { SectionManagementService } from '../../../section-management/services/section-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { ExamTermManagementService } from '../../../exam-term-management/services/exam-term-management.service';
import { ExamStatus } from '../../models/exam.model';
import { LoggerService } from '../../../../core/services/logger.service';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { SectionResponse } from '../../../section-management/models/SectionResponse';

@Component({
    selector: 'app-exam-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent],
    templateUrl: './exam-create-form.component.html',
    styleUrls: ['./exam-create-form.component.css']
})
export class ExamCreateFormComponent implements OnInit, OnDestroy {
    @ViewChild('toaster') toaster!: ToasterComponent;

    examForm: FormGroup;
    sectionSearchControl = new FormControl('');
    loading = false;
    isEditMode = false;
    examId?: string | number;

    // Data for dropdowns
    academicYears: any[] = [];
    campuses: CampusResponse[] = [];
    standards: StandardResponse[] = [];
    sections: SectionResponse[] = [];
    filteredSections: any[] = []; // For the matrix search
    examTerms: any[] = [];
    examStatuses = Object.values(ExamStatus);

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private examService: ExamManagementService,
        private campusService: CampusManagementService,
        private standardService: StandardManagementService,
        private sectionService: SectionManagementService,
        private academicYearService: AcademicYearManagementService,
        private examTermService: ExamTermManagementService,
        private logger: LoggerService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.examForm = this.fb.group({
            academicYearId: ['', Validators.required],
            examTermId: ['', Validators.required],
            commonName: [''],
            startDate: [''],
            endDate: [''],
            status: [ExamStatus.DRAFT, Validators.required],
            campusId: ['', Validators.required],
            standardId: ['', Validators.required],
            selectedSections: this.fb.array([], Validators.required)
        });
    }

    ngOnInit(): void {
        this.loadInitialData();
        this.subscribeToCascadingFilters();
        this.subscribeToSectionSearch();

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.examId = params['id'];
                this.loadExamData(this.examId as any);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get selectedSections(): FormArray {
        return this.examForm.get('selectedSections') as FormArray;
    }

    getSectionIndex(sectionId: any): number {
        return (this.selectedSections.controls as FormGroup[]).findIndex(c => c.get('sectionId')?.value === sectionId);
    }

    private loadInitialData() {
        this.campusService.getAllCampuses().subscribe((resp: any) => {
            this.campuses = resp.body || [];
        });

        this.academicYearService.getAcademicYears().subscribe((resp: any) => {
            this.academicYears = resp.body || [];

            // Pre-select current academic year
            const currentYear = this.academicYears.find(year => year.isCurrent);
            if (currentYear && !this.isEditMode) {
                this.examForm.patchValue({ academicYearId: currentYear.id });
            }
        });
    }

    private subscribeToCascadingFilters() {
        // Academic Year -> Exam Terms
        this.examForm.get('academicYearId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(yearId => {
            this.examTerms = [];
            this.examForm.patchValue({ examTermId: '' }, { emitEvent: false });
            if (yearId) {
                this.examTermService.getTermsByYear(+yearId).subscribe((resp: any) => {
                    this.examTerms = resp.body || [];
                });
            }
        });

        // Campus -> Standards
        this.examForm.get('campusId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(campusId => {
            this.standards = [];
            this.sections = [];
            this.examForm.patchValue({ standardId: '' }, { emitEvent: false });
            this.clearSections();
            if (campusId) {
                this.standardService.getStandardsByCampusId(campusId).subscribe((resp: any) => {
                    this.standards = resp.body || [];
                });
            }
        });

        // Standard -> Sections (Matrix)
        this.examForm.get('standardId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(standardId => {
            this.sections = [];
            this.filteredSections = [];
            this.clearSections();
            if (standardId) {
                this.sectionService.getSectionByStandardId(standardId).subscribe((resp: any) => {
                    this.sections = resp.body || [];
                    this.filteredSections = [...this.sections];
                    this.initializeSections();
                });
            }
        });

        // Sync Common Fields to Matrix
        this.subscribeToCommonSync();
    }

    private subscribeToCommonSync() {
        // Sync Common Name
        this.examForm.get('commonName')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(name => {
            this.selectedSections.controls.forEach(control => {
                const sectionName = control.get('sectionName')?.value;
                control.get('examName')?.setValue(`${name ? name + ' - ' : ''}${sectionName}`, { emitEvent: false });
            });
        });

        // Sync Start Date
        this.examForm.get('startDate')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(date => {
            this.selectedSections.controls.forEach(control => {
                control.get('startDate')?.setValue(date, { emitEvent: false });
            });
        });

        // Sync End Date
        this.examForm.get('endDate')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(date => {
            this.selectedSections.controls.forEach(control => {
                control.get('endDate')?.setValue(date, { emitEvent: false });
            });
        });

        // Sync Status
        this.examForm.get('status')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(status => {
            this.selectedSections.controls.forEach(control => {
                control.get('status')?.setValue(status, { emitEvent: false });
            });
        });
    }

    private subscribeToSectionSearch() {
        this.sectionSearchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        ).subscribe((search: string | null) => {
            this.filterSections(search || '');
        });
    }

    private filterSections(keyword: string) {
        if (!keyword) {
            this.filteredSections = [...this.sections];
        } else {
            this.filteredSections = this.sections.filter(s =>
                s.sectionName.toLowerCase().includes(keyword.toLowerCase())
            );
        }
    }

    private clearSections() {
        while (this.selectedSections.length !== 0) {
            this.selectedSections.removeAt(0);
        }
    }

    private initializeSections() {
        const commonName = this.examForm.get('commonName')?.value;
        const startDate = this.examForm.get('startDate')?.value;
        const endDate = this.examForm.get('endDate')?.value;
        const status = this.examForm.get('status')?.value;

        this.sections.forEach(section => {
            const group = this.fb.group({
                sectionId: [section.id],
                sectionName: [section.sectionName],
                selected: [false],
                examName: [`${commonName ? commonName + ' - ' : ''}${section.sectionName}`],
                startDate: [startDate],
                endDate: [endDate],
                status: [status]
            });

            // Dynamic validators based on selection
            group.get('selected')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(selected => {
                const fields = ['examName', 'startDate', 'endDate', 'status'];
                fields.forEach(field => {
                    const control = group.get(field);
                    if (selected) {
                        control?.setValidators(Validators.required);
                    } else {
                        control?.clearValidators();
                    }
                    control?.updateValueAndValidity({ emitEvent: false });
                });
            });

            this.selectedSections.push(group);
        });
    }

    loadExamData(id: string | number) {
        this.loading = true;
        this.examService.getExamById(id).subscribe({
            next: (resp) => {
                const exam = resp.body;
                this.examForm.patchValue({
                    academicYearId: exam.academicYearId,
                    examTermId: exam.examTermId,
                    commonName: exam.name,
                    startDate: exam.startDate,
                    endDate: exam.endDate,
                    status: exam.status,
                    campusId: exam.campusId,
                    standardId: exam.standardId
                });
                // Note: In edit mode, we might only be editing ONE section exam
                // The matrix is mainly for creation. For editing, we could show just the one.
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Error loading exam', err);
                this.toaster?.show('Failed to load exam details.', 'error');
            }
        });
    }

    onSubmit() {
        console.log(this.examForm.value);
        if (this.examForm.invalid) {
            this.examForm.markAllAsTouched();
            return;
        }

        const formValue = this.examForm.value;
        const selectedSections = formValue.selectedSections.filter((s: any) => s.selected);

        if (selectedSections.length === 0 && !this.isEditMode) {
            this.toaster?.show('Please select at least one section.', 'warning');
            return;
        }

        this.loading = true;

        if (this.isEditMode) {
            // Update individual exam
            const payload = {
                name: formValue.commonName, //common
                academicYearId: formValue.academicYearId,
                examTermId: formValue.examTermId,
                campusId: formValue.campusId,
                standardId: formValue.standardId,
                sectionId: formValue.selectedSections[0]?.sectionId, // Fallback
                startDate: formValue.startDate,
                endDate: formValue.endDate,
                status: formValue.status
            };

            this.examService.saveExam(+this.examId!, payload as any).subscribe({
                next: () => {
                    this.loading = false;
                    this.toaster?.show('Exam updated successfully.', 'success');
                    this.router.navigate(['/exams']);
                },
                error: (err) => {
                    this.loading = false;
                    this.logger.error('Error updating exam', err);
                    this.toaster?.show('Failed to update exam.', 'error');
                }
            });
        } else {
            // Bulk create for selected sections using matrix values
            const creationObservables = selectedSections.map((s: any) => {
                const payload = {
                    name: s.examName,
                    academicYearId: formValue.academicYearId,
                    examTermId: formValue.examTermId,
                    campusId: formValue.campusId,
                    standardId: formValue.standardId,
                    sectionId: s.sectionId,
                    startDate: s.startDate,
                    endDate: s.endDate,
                    status: s.status
                };
                return this.examService.saveExam(null, payload as any);
            });

            this.saveMultipleExams(creationObservables);
        }
    }

    private saveMultipleExams(observables: any[]) {
        let completed = 0;
        let errors = 0;

        observables.forEach(obs => {
            obs.subscribe({
                next: () => {
                    completed++;
                    this.checkCompletion(completed, errors, observables.length);
                },
                error: () => {
                    errors++;
                    completed++;
                    this.checkCompletion(completed, errors, observables.length);
                }
            });
        });
    }

    private checkCompletion(completed: number, errors: number, total: number) {
        if (completed === total) {
            this.loading = false;
            if (errors === 0) {
                this.toaster?.show('Exams created successfully for all sections.', 'success');
                this.router.navigate(['/exams']);
            } else {
                this.toaster?.show(`Created ${total - errors} exams. ${errors} failed.`, 'warning');
                this.router.navigate(['/exams']);
            }
        }
    }

    onCancel() {
        this.router.navigate(['/exams']);
    }

    toggleSelectAll(event: any) {
        const checked = event.target.checked;
        this.selectedSections.controls.forEach(control => {
            control.get('selected')?.setValue(checked);
        });
    }
}
