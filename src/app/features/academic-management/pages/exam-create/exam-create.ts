import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AcademicManagementService } from '../../services/academic-management.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-exam-create',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './exam-create.html'
})
export class ExamCreatePage implements OnInit {
    examForm: FormGroup;
    loading = false;
    isEdit = false;
    examTypes: any[] = [];
    examTerms: any[] = [];
    examId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private academicService: AcademicManagementService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.examForm = this.fb.group({
            name: ['', Validators.required],
            examTypeId: ['', Validators.required],
            examTermId: ['', Validators.required],
            academicYearId: [1],
            campusId: [1],
            standardId: [1],
            sectionId: [1],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            totalMarks: [100, Validators.required],
            status: ['DRAFT']
        });
    }

    ngOnInit(): void {
        this.loadInitialData();
        this.examId = this.route.snapshot.paramMap.get('id');
        if (this.examId) {
            this.isEdit = true;
            this.loadExam();
        }
    }

    loadInitialData() {
        this.academicService.getExamTypes().subscribe(resp => this.examTypes = resp.body || []);
        this.academicService.getExamTerms(1).subscribe(resp => this.examTerms = resp.body || []);
    }

    loadExam() {
        // patch form
    }

    onSubmit() {
        if (this.examForm.invalid) return;
        this.loading = true;
        this.academicService.saveExam(this.examId, this.examForm.value).subscribe({
            next: () => this.router.navigate(ROUTES.ACADEMIC.EXAMS.LIST),
            error: () => this.loading = false
        });
    }

    onCancel() {
        this.router.navigate(ROUTES.ACADEMIC.EXAMS.LIST);
    }
}
