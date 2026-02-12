import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectManagementService } from '../../services/subject-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { SubjectGroup } from '../../models/subject.model';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
    selector: 'app-subject-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent],
    templateUrl: './subject-create-form.component.html'
})
export class SubjectCreateFormComponent implements OnInit {
    @ViewChild('toaster') toaster!: ToasterComponent;
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
            core: [false],
            active: [true]
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
        this.loading = true;
        this.subjectService.getSubjectGroups().subscribe({
            next: (resp) => {
                this.groups = resp.body || [];
                this.logger.success('Subject groups loaded successfully');
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Failed to load subject groups', err);
                this.toaster?.show('Failed to load subject groups.', 'error');
            }
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
                this.toaster?.show('Failed to load subject.', 'error');
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
                this.toaster?.show(this.isEdit ? 'Subject updated successfully.' : 'Subject created successfully.', 'success');

                // Add delay to ensure toaster is visible before navigation
                setTimeout(() => {
                    this.router.navigate(ROUTES.ACADEMIC.SUBJECTS.LIST);
                }, 1000);
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Failed to save subject', err);
                this.toaster?.show('Failed to save subject.', 'error');
            }
        });
    }

    onCancel() {
        this.logger.info('Cancelling subject form');
        this.router.navigate(ROUTES.ACADEMIC.SUBJECTS.LIST);
    }
}
