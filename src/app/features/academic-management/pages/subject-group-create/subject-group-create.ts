import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicManagementService } from '../../services/academic-management.service';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-subject-group-create',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './subject-group-create.html'
})
export class SubjectGroupCreate implements OnInit {
    groupForm: FormGroup;
    isEdit = false;
    groupId: string | null = null;
    loading = false;
    texts = PageTexts.academic.subjectGroups;

    constructor(
        private fb: FormBuilder,
        private academicService: AcademicManagementService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.groupForm = this.fb.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            description: [''],
            isActive: [true]
        });
    }

    ngOnInit(): void {
        this.groupId = this.route.snapshot.paramMap.get('id');
        if (this.groupId) {
            this.isEdit = true;
            this.loadGroup();
        }
    }

    loadGroup() {
        this.academicService.getSubjectGroupById(this.groupId!).subscribe({
            next: (resp) => this.groupForm.patchValue(resp.body),
            error: (err) => console.error(err)
        });
    }

    onSubmit() {
        if (this.groupForm.invalid) return;
        this.loading = true;
        this.academicService.saveSubjectGroup(this.groupId, this.groupForm.value).subscribe({
            next: () => this.router.navigate(ROUTES.ACADEMIC.SUBJECT_GROUPS.LIST),
            error: (err) => {
                this.loading = false;
                console.error(err);
            }
        });
    }

    onCancel() {
        this.router.navigate(ROUTES.ACADEMIC.SUBJECT_GROUPS.LIST);
    }
}
