import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeScaleManagementService } from '../../services/grade-scale-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
    selector: 'app-grade-scale-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent],
    templateUrl: './grade-scale-create-form.component.html'
})
export class GradeScaleCreateFormComponent implements OnInit {
    @ViewChild('toaster') toaster!: ToasterComponent;
    gradeScaleForm: FormGroup;
    isEdit = false;
    gradeScaleId: string | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private gradeScaleService: GradeScaleManagementService,
        private route: ActivatedRoute,
        private router: Router,
        private logger: LoggerService
    ) {
        this.gradeScaleForm = this.fb.group({
            grade: ['', Validators.required],
            minPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
            maxPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
            remarks: [''],
            active: [true]
        });
    }

    ngOnInit(): void {
        this.gradeScaleId = this.route.snapshot.paramMap.get('id');
        if (this.gradeScaleId) {
            this.isEdit = true;
            this.loadGradeScale();
        }
    }

    loadGradeScale() {
        this.loading = true;
        this.gradeScaleService.getGradeScaleById(this.gradeScaleId!).subscribe({
            next: (resp) => {
                const scale = resp.body;
                if (scale) {
                    this.gradeScaleForm.patchValue(scale);
                }
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Failed to load grade scale', err);
                this.toaster?.show('Failed to load grade scale.', 'error');
            }
        });
    }

    onSubmit() {
        if (this.gradeScaleForm.invalid) return;

        this.loading = true;
        const payload = this.gradeScaleForm.value;
        if (this.isEdit) {
            payload.id = this.gradeScaleId;
        }

        this.gradeScaleService.saveGradeScale(this.gradeScaleId ? +this.gradeScaleId : null, payload).subscribe({
            next: () => {
                this.toaster?.show(this.isEdit ? 'Grade scale updated successfully.' : 'Grade scale created successfully.', 'success');
                setTimeout(() => {
                    this.router.navigate(ROUTES.ACADEMIC.RESULTS.GRADE_SCALES);
                }, 1000);
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Failed to save grade scale', err);
                this.toaster?.show('Failed to save grade scale.', 'error');
            }
        });
    }

    onCancel() {
        this.router.navigate(ROUTES.ACADEMIC.RESULTS.GRADE_SCALES);
    }
}
