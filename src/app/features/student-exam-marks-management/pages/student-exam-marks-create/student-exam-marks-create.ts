import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentExamMarksManagementService } from '../../services/student-exam-marks-management.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-student-exam-marks-create',
    templateUrl: './student-exam-marks-create.html',
    styleUrls: ['./student-exam-marks-create.css'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class StudentExamMarksCreate implements OnInit {
    marksForm!: FormGroup;
    isEditMode = false;
    id: string | null = null;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private service: StudentExamMarksManagementService
    ) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.id;
        this.initializeForm();
        if (this.isEditMode) {
            this.loadMarksData(this.id);
        }
    }

    private initializeForm(): void {
        this.marksForm = this.fb.group({
            examId: ['', Validators.required],
            subjectId: ['', Validators.required],
            studentId: ['', Validators.required],
            obtainedMarks: ['', [Validators.required, Validators.min(0)]],
            remarks: [''],
            active: [true]
        });
    }

    private loadMarksData(id: any): void {
        // Logic to load data for edit mode
    }

    onSubmit(): void {
        if (this.marksForm.invalid) {
            this.marksForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.service.recordMarks(this.marksForm.value).subscribe({
            next: (resp: HttpResponse<any>) => {
                this.isLoading = false;
                this.router.navigate(ROUTES.STUDENT_EXAM_MARKS.LIST);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error saving marks:', err);
                this.isLoading = false;
            }
        });
    }

    cancel(): void {
        this.router.navigate(ROUTES.STUDENT_EXAM_MARKS.LIST);
    }
}
