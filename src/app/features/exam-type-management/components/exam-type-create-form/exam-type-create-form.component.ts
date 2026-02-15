import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamTypeManagementService } from '../../services/exam-type-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
    selector: 'app-exam-type-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent],
    templateUrl: './exam-type-create-form.component.html'
})
export class ExamTypeCreateFormComponent implements OnInit {
    @ViewChild('toaster') toaster!: ToasterComponent;
    examTypeForm: FormGroup;
    isEdit = false;
    examTypeId: string | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private examTypeService: ExamTypeManagementService,
        private route: ActivatedRoute,
        private router: Router,
        private logger: LoggerService
    ) {
        this.examTypeForm = this.fb.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            description: [''],
            active: [true]
        });
    }

    ngOnInit(): void {
        this.logger.group('ExamTypeCreateFormComponent');
        this.examTypeId = this.route.snapshot.paramMap.get('id');
        if (this.examTypeId) {
            this.isEdit = true;
            this.loadExamType();
        }
        this.logger.groupEnd();
    }

    loadExamType() {
        this.loading = true;
        this.examTypeService.getExamTypeById(this.examTypeId!).subscribe({
            next: (resp) => {
                const type = resp.body;
                if (type) {
                    this.examTypeForm.patchValue(type);
                    this.logger.success('Exam type loaded successfully');
                } else {
                    this.logger.error('Exam type data is empty');
                    this.toaster?.show('Exam type not found.', 'error');
                }
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Failed to load exam type', err);
                this.toaster?.show('Failed to load exam type.', 'error');
            }
        });
    }

    onSubmit() {
        if (this.examTypeForm.invalid) return;

        this.loading = true;
        const payload = this.examTypeForm.value;
        if (this.isEdit) {
            payload.id = this.examTypeId;
        }

        this.examTypeService.saveExamType(this.examTypeId ? +this.examTypeId : null, payload).subscribe({
            next: () => {
                this.toaster?.show(this.isEdit ? 'Exam type updated successfully.' : 'Exam type created successfully.', 'success');
                setTimeout(() => {
                    this.router.navigate(ROUTES.ACADEMIC.EXAMS.TYPES);
                }, 1000);
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Failed to save exam type', err);
                this.toaster?.show('Failed to save exam type.', 'error');
            }
        });
    }

    onCancel() {
        this.router.navigate(ROUTES.ACADEMIC.EXAMS.TYPES);
    }
}
