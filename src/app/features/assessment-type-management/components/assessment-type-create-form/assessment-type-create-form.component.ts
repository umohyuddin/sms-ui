import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentTypeManagementService } from '../../services/assessment-type-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
    selector: 'app-assessment-type-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent],
    templateUrl: './assessment-type-create-form.component.html'
})
export class AssessmentTypeCreateFormComponent implements OnInit {
    @ViewChild('toaster') toaster!: ToasterComponent;
    assessmentTypeForm: FormGroup;
    isEdit = false;
    assessmentTypeId: string | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private assessmentTypeService: AssessmentTypeManagementService,
        private route: ActivatedRoute,
        private router: Router,
        private logger: LoggerService
    ) {
        this.assessmentTypeForm = this.fb.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            description: [''],
            active: [true]
        });
    }

    ngOnInit(): void {
        this.logger.group('AssessmentTypeCreateFormComponent');
        this.assessmentTypeId = this.route.snapshot.paramMap.get('id');
        if (this.assessmentTypeId) {
            this.isEdit = true;
            this.loadAssessmentType();
        }
        this.logger.groupEnd();
    }

    loadAssessmentType() {
        this.loading = true;
        this.assessmentTypeService.getAssessmentTypeById(this.assessmentTypeId!).subscribe({
            next: (resp) => {
                const type = resp.body;
                if (type) {
                    this.assessmentTypeForm.patchValue(type);
                    this.logger.success('Assessment type loaded successfully');
                } else {
                    this.logger.error('Assessment type data is empty');
                    this.toaster?.show('Assessment type not found.', 'error');
                }
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Failed to load assessment type', err);
                this.toaster?.show('Failed to load assessment type.', 'error');
            }
        });
    }

    onSubmit() {
        if (this.assessmentTypeForm.invalid) return;

        this.loading = true;
        const payload = this.assessmentTypeForm.value;
        if (this.isEdit) {
            payload.id = this.assessmentTypeId;
        }

        this.assessmentTypeService.saveAssessmentType(this.assessmentTypeId ? +this.assessmentTypeId : null, payload).subscribe({
            next: () => {
                this.toaster?.show(this.isEdit ? 'Assessment type updated successfully.' : 'Assessment type created successfully.', 'success');
                setTimeout(() => {
                    this.router.navigate(ROUTES.ACADEMIC.EXAMS.ASSESSMENT_TYPES);
                }, 1000);
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Failed to save assessment type', err);
                this.toaster?.show('Failed to save assessment type.', 'error');
            }
        });
    }

    onCancel() {
        this.router.navigate(ROUTES.ACADEMIC.EXAMS.ASSESSMENT_TYPES);
    }
}
