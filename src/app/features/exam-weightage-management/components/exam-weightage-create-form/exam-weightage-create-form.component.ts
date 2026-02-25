import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamWeightageManagementService } from '../../services/exam-weightage-management.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { StudentManagementService } from '../../../student-management/services/student-management.service';
import { BulkExamWeightageRequestDTO } from '../../models/exam-weightage-request';

@Component({
    selector: 'app-exam-weightage-create-form',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './exam-weightage-create-form.component.html',
    styleUrls: ['./exam-weightage-create-form.component.css']
})
export class ExamWeightageCreateFormComponent implements OnInit {
    createForm!: FormGroup;
    isEditMode = false;
    itemId: string | null = null;
    isLoading = false;

    campuses: any[] = [];
    standards: any[] = [];
    examTerms: any[] = [];
    subjects: any[] = [];
    currentAcademicYearId: any;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private service: ExamWeightageManagementService,
        private campusService: CampusManagementService,
        private standardService: StandardManagementService,
        private studentService: StudentManagementService
    ) { }

    ngOnInit() {
        this.initializeForm();
        this.loadInitialData();
        this.itemId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.itemId;
    }

    private initializeForm() {
        this.createForm = this.fb.group({
            campusId: ['', Validators.required],
            standardId: ['', Validators.required],
            examTermId: ['', Validators.required],
            weightages: this.fb.array([])
        });
    }

    get weightages(): FormArray {
        return this.createForm.get('weightages') as FormArray;
    }

    private loadInitialData() {
        this.campusService.getAllCampuses().subscribe(resp => {
            this.campuses = resp.body;
        });

        this.studentService.getCurrentAcademicYear().subscribe(resp => {
            if (resp.body) {
                this.currentAcademicYearId = resp.body.id;
                this.loadExamTerms(this.currentAcademicYearId);
                // If standard was already selected, trigger reload to fix race condition
                const standardId = this.createForm.get('standardId')?.value;
                if (standardId) {
                    this.onStandardChange();
                }
            }
        });
    }

    private loadExamTerms(academicYearId: number) {
        this.service.getExamTermsByYear(academicYearId).subscribe(resp => {
            this.examTerms = resp.body;
        });
    }

    onCampusChange() {
        const campusId = this.createForm.get('campusId')?.value;
        this.standards = [];
        this.createForm.patchValue({ standardId: '' });
        this.weightages.clear();

        if (campusId) {
            this.standardService.getStandardsByCampusId(campusId).subscribe(resp => {
                this.standards = resp.body;
            });
        }
    }

    onStandardChange() {
        const standardId = this.createForm.get('standardId')?.value;
        this.weightages.clear();
        this.subjects = [];

        if (standardId && this.currentAcademicYearId) {
            this.service.getStandardSubjects(standardId, this.currentAcademicYearId).subscribe(resp => {
                this.subjects = resp.body || [];
                this.populateWeightages();
            });
        }
    }

    private populateWeightages() {
        this.weightages.clear();
        this.subjects.forEach(subject => {
            // Handle potential different ID naming from API
            const subId = subject.subjectId || subject.id;
            const subName = subject.subjectName || subject.name || 'Unknown Subject';

            this.weightages.push(this.fb.group({
                subjectId: [subId, Validators.required],
                subjectName: [subName],
                weightPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
                active: [true]
            }));
        });
    }

    onSubmit(): void {
        console.log('Form Submit Clicked');
        console.log('Form Valid:', this.createForm.valid);
        console.log('Form Value:', this.createForm.value);

        if (this.createForm.invalid) {
            console.log('Form Invalid, Errors:', this.getFormErrors(this.createForm));
            this.createForm.markAllAsTouched();
            return;
        }

        if (!this.currentAcademicYearId) {
            console.error('Academic Year ID missing');
            return;
        }

        this.isLoading = true;
        const formValue = this.createForm.value;
        const payload: BulkExamWeightageRequestDTO = {
            academicYearId: Number(this.currentAcademicYearId),
            examTermId: Number(formValue.examTermId),
            standardId: Number(formValue.standardId),
            weightages: formValue.weightages.map((w: any) => ({
                subjectId: Number(w.subjectId),
                weightPercentage: w.weightPercentage,
                active: w.active
            }))
        };

        console.log('Final Payload:', payload);

        this.service.saveWeightage(payload).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/exam-weightage-management']);
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Error saving weightages:', error);
            }
        });
    }

    private getFormErrors(form: FormGroup | FormArray) {
        const errors: any = {};
        Object.keys(form.controls).forEach(key => {
            const control = (form as any).controls[key];
            if (control instanceof FormGroup || control instanceof FormArray) {
                errors[key] = this.getFormErrors(control);
            } else if (control.errors) {
                errors[key] = control.errors;
            }
        });
        return errors;
    }

    goBack() {
        this.router.navigate(['/exam-weightage-management']);
    }
}
