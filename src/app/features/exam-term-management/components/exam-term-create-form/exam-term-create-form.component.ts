import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamTermManagementService } from '../../services/exam-term-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
    selector: 'app-exam-term-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent],
    templateUrl: './exam-term-create-form.component.html'
})
export class ExamTermCreateFormComponent implements OnInit {
    @ViewChild('toaster') toaster!: ToasterComponent;
    examTermForm: FormGroup;
    isEdit = false;
    examTermId: string | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private examTermService: ExamTermManagementService,
        private route: ActivatedRoute,
        private router: Router,
        private logger: LoggerService
    ) {
        this.examTermForm = this.fb.group({
            name: ['', Validators.required],
            sequenceNo: [0, Validators.required],
            academicYearId: [1, Validators.required], // Hardcoded for now
            active: [true]
        });
    }

    ngOnInit(): void {
        this.logger.group('ExamTermCreateFormComponent');
        this.examTermId = this.route.snapshot.paramMap.get('id');
        if (this.examTermId) {
            this.isEdit = true;
            this.loadExamTerm();
        }
        this.logger.groupEnd();
    }

    loadExamTerm() {
        this.loading = true;
        this.examTermService.getExamTermById(this.examTermId!).subscribe({
            next: (resp) => {
                const term = resp.body;
                if (term) {
                    this.examTermForm.patchValue(term);
                    this.logger.success('Exam term loaded successfully');
                } else {
                    this.logger.error('Exam term data is empty');
                    this.toaster?.show('Exam term not found.', 'error');
                }
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Failed to load exam term', err);
                this.toaster?.show('Failed to load exam term.', 'error');
            }
        });
    }

    onSubmit() {
        if (this.examTermForm.invalid) return;

        this.loading = true;
        const payload = this.examTermForm.value;
        if (this.isEdit) {
            payload.id = this.examTermId;
        }

        this.examTermService.saveExamTerm(this.examTermId ? +this.examTermId : null, payload).subscribe({
            next: () => {
                this.toaster?.show(this.isEdit ? 'Exam term updated successfully.' : 'Exam term created successfully.', 'success');
                setTimeout(() => {
                    this.router.navigate(ROUTES.ACADEMIC.EXAMS.TERMS);
                }, 1000);
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Failed to save exam term', err);
                this.toaster?.show('Failed to save exam term.', 'error');
            }
        });
    }

    onCancel() {
        this.router.navigate(ROUTES.ACADEMIC.EXAMS.TERMS);
    }
}
