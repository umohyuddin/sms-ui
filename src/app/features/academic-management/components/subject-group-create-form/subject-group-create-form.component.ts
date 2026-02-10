import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicManagementService } from '../../../services/academic-management.service';
import { PageTexts } from '../../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../../core/const/APP_ROUTES';
import { LoggerService } from '../../../../../core/services/logger.service';

@Component({
    selector: 'app-subject-group-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './subject-group-create-form.component.html'
})
export class SubjectGroupCreateFormComponent implements OnInit {
    groupForm: FormGroup;
    isEdit = false;
    groupId: string | null = null;
    loading = false;
    texts = PageTexts.academic.subjectGroups;

    constructor(
        private fb: FormBuilder,
        private academicService: AcademicManagementService,
        private route: ActivatedRoute,
        private router: Router,
        private logger: LoggerService
    ) {
        this.groupForm = this.fb.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            description: [''],
            isActive: [true]
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
        this.academicService.getSubjectGroupById(this.groupId!).subscribe({
            next: (resp) => {
                this.groupForm.patchValue(resp.body);
                this.logger.success('Subject group loaded successfully');
            },
            error: (err) => {
                this.logger.error('Failed to load subject group', err);
            }
        });
    }

    onSubmit() {
        if (this.groupForm.invalid) return;
        
        this.loading = true;
        this.logger.info('Submitting subject group form', this.groupForm.value);
        
        this.academicService.saveSubjectGroup(this.groupId, this.groupForm.value).subscribe({
            next: () => {
                this.logger.success('Subject group saved successfully');
                this.router.navigate(ROUTES.ACADEMIC.SUBJECT_GROUPS.LIST);
            },
            error: (err) => {
                this.loading = false;
                this.logger.error('Failed to save subject group', err);
            }
        });
    }

    onCancel() {
        this.logger.info('Cancelling subject group form');
        this.router.navigate(ROUTES.ACADEMIC.SUBJECT_GROUPS.LIST);
    }
}
