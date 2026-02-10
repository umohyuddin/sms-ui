import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AcademicManagementService } from '../../services/academic-management.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-teacher-assignment-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './teacher-assignment-form.html'
})
export class TeacherAssignmentForm implements OnInit {
    assignmentForm: FormGroup;
    loading = false;
    isEdit = false;
    assignmentId: string | null = null;
    teachers: any[] = [];
    subjects: any[] = [];
    standards: any[] = [];
    sections: any[] = [];

    constructor(
        private fb: FormBuilder,
        private academicService: AcademicManagementService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.assignmentForm = this.fb.group({
            employeeId: ['', Validators.required],
            subjectId: ['', Validators.required],
            standardId: ['', Validators.required],
            sectionId: ['', Validators.required],
            academicYearId: [1],
            effectiveFrom: [new Date().toISOString().split('T')[0], Validators.required],
            isPrimary: [true]
        });
    }

    ngOnInit(): void {
        this.loadInitialData();
        this.assignmentId = this.route.snapshot.paramMap.get('id');
        if (this.assignmentId) {
            this.isEdit = true;
            // Load assignment data when editing
        }
    }

    loadInitialData() {
        this.academicService.getSubjects().subscribe(resp => this.subjects = resp.body || []);
        // TODO: Load teachers from employee service
        // TODO: Load standards from campus service
    }

    onStandardChange() {
        // TODO: Load sections for selected standard
    }

    onSubmit() {
        if (this.assignmentForm.invalid) return;
        this.loading = true;
        this.academicService.assignTeacher(this.assignmentForm.value).subscribe({
            next: () => this.router.navigate(ROUTES.ACADEMIC.MAPPING.TEACHER_ASSIGNMENT),
            error: (err) => {
                this.loading = false;
                console.error(err);
            }
        });
    }

    onCancel() {
        this.router.navigate(ROUTES.ACADEMIC.MAPPING.TEACHER_ASSIGNMENT);
    }
}
