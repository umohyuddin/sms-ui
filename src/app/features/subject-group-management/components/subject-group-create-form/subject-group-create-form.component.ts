import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectGroupManagementService } from '../../services/subject-group-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
    selector: 'app-subject-group-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent],
    templateUrl: './subject-group-create-form.component.html'
})
export class SubjectGroupCreateFormComponent implements OnInit {
    @ViewChild('toaster') toaster!: ToasterComponent;
    groupForm: FormGroup;
    isEdit = false;
    groupId: string | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private subjectGroupService: SubjectGroupManagementService,
        private route: ActivatedRoute,
        private router: Router,
        private logger: LoggerService
    ) {
        this.groupForm = this.fb.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            description: [''],
            active: [true]
        });
    }

    ngOnInit(): void {
        this.logger.group('SubjectGroupCreateFormComponent');
        this.logger.info('Initializing subject group form');
        
        this.groupId = this.route.snapshot.paramMap.get('id');
        if (this.groupId) {
            this.isEdit = true;
            this.loadGroup();
        }
        
        this.logger.groupEnd();
    }

    loadGroup() {
        this.logger.info('Loading subject group data', this.groupId);
        this.loading = true;
        this.subjectGroupService.getSubjectGroupById(this.groupId!).subscribe({
            next: (resp) => {
                if (resp.body) {
                    this.groupForm.patchValue(resp.body);
                    this.logger.success('Subject group loaded successfully');
                } else {
                    this.logger.error('Subject group data is empty');
                    this.toaster?.show('Subject group data is empty.', 'warning');
                }
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.toaster?.show('Failed to load subject group.', 'error');
                this.logger.error('Failed to load subject group', err);
            }
        });
    }

    onSubmit() {
        if (this.groupForm.invalid) return;
        
        this.loading = true;
        this.logger.info('Submitting subject group form', this.groupForm.value);
        
        this.subjectGroupService.saveSubjectGroup(this.groupId, this.groupForm.value).subscribe({
            next: () => {
                this.logger.success('Subject group saved successfully');
                this.toaster?.show(
                    this.isEdit ? 'Subject group updated successfully.' : 'Subject group saved successfully.',
                    'success'
                );
                setTimeout(() => {
                    this.router.navigate(ROUTES.ACADEMIC.SUBJECT_GROUPS.LIST);
                }, 1000);
            },
            error: (err) => {
                this.loading = false;
                this.toaster?.show('Failed to save subject group.', 'error');
                this.logger.error('Failed to save subject group', err);
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    onCancel() {
        this.logger.info('Cancelling subject group form');
        this.router.navigate(ROUTES.ACADEMIC.SUBJECT_GROUPS.LIST);
    }
}
