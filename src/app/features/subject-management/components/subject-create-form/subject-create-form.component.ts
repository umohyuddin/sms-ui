import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectManagementService } from '../../services/subject-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { SubjectGroup } from '../../models/subject.model';

@Component({
    selector: 'app-subject-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './subject-create-form.component.html'
})
export class SubjectCreateFormComponent implements OnInit {
    subjectForm: FormGroup;
    isEdit = false;
    subjectId: string | null = null;
    loading = false;
    groups: SubjectGroup[] = [];

    constructor(
        private fb: FormBuilder,
        private subjectService: SubjectManagementService,
        private route: ActivatedRoute,
        private router: Router,
        private logger: LoggerService
    ) {
        this.subjectForm = this.fb.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            subjectGroupId: ['', Validators.required],
            description: [''],
            isElective: [false],
            isActive: [true]
        });
    }

    ngOnInit(): void {
        this.logger.group('SubjectCreateFormComponent');
        this.logger.info('Initializing subject form');

        this.loadGroups();
        this.subjectId = this.route.snapshot.paramMap.get('id');
        if (this.subjectId) {
            this.isEdit = true;
            this.loadSubject();
        }

        this.logger.groupEnd();
    }

    loadGroups() {
        this.logger.info('Loading subject groups');
        this.subjectService.getSubjectGroups().subscribe({
            next: (resp) => {
                this.groups = resp.body || [];
                this.logger.success('Subject groups loaded successfully');
            },
            error: (err) => this.logger.error('Failed to load subject groups', err)
        });
    }

    loadSubject() {
        this.logger.info('Loading subject data', this.subjectId);
        this.loading = true;
        this.subjectService.getSubjectById(this.subjectId!).subscribe({
            next: (resp) => {
                if (resp.body) {
                    this.subjectForm.patchValue(resp.body);
                    this.logger.success('Subject loaded successfully');
                } else {
                    this.logger.error('Subject data is empty');
                }
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Failed to load subject', err);
            }
        });
    }

    onSubmit() {
        if (this.subjectForm.invalid) return;

        this.loading = true;
        this.logger.info('Submitting subject form', this.subjectForm.value);

        this.subjectService.saveSubject(this.subjectId, this.subjectForm.value).subscribe({
            next: () => {
                this.logger.success('Subject saved successfully');
                this.router.navigate(ROUTES.ACADEMIC.SUBJECTS.LIST);
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Failed to save subject', err);
            }
        });
    }

    onCancel() {
        this.logger.info('Cancelling subject form');
        this.router.navigate(ROUTES.ACADEMIC.SUBJECTS.LIST);
    }
}
