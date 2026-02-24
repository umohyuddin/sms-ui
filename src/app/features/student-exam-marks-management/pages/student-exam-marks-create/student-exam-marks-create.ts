import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentExamMarksManagementService } from '../../services/student-exam-marks-management.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { SectionManagementService } from '../../../section-management/services/section-management.service';
import { ExamManagementService } from '../../../exam-management/services/exam-management.service';
import { StudentManagementService } from '../../../student-management/services/student-management.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-student-exam-marks-create',
    templateUrl: './student-exam-marks-create.html',
    styleUrls: ['./student-exam-marks-create.css'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class StudentExamMarksCreate implements OnInit {
    marksForm!: FormGroup;
    isEditMode = false;
    id: string | null = null;
    isLoading = false;

    campuses: any[] = [];
    standards: any[] = [];
    sections: any[] = [];
    exams: any[] = [];
    subjects: any[] = [];
    students: any[] = [];
    currentAcademicYearId: any;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private service: StudentExamMarksManagementService,
        private campusService: CampusManagementService,
        private standardService: StandardManagementService,
        private sectionService: SectionManagementService,
        private examService: ExamManagementService,
        private studentService: StudentManagementService
    ) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.id;
        this.initializeForm();
        this.loadInitialData();
        if (this.isEditMode) {
            this.loadMarksData(this.id);
        }
    }

    private initializeForm(): void {
        this.marksForm = this.fb.group({
            campusId: ['', Validators.required],
            standardId: ['', Validators.required],
            sectionId: ['', Validators.required],
            examId: ['', Validators.required],
            subjectId: ['', Validators.required],
            examMarks: this.fb.array([])
        });
    }

    get examMarks(): FormArray {
        return this.marksForm.get('examMarks') as FormArray;
    }

    private loadInitialData(): void {
        this.campusService.getAllCampuses().subscribe(resp => {
            this.campuses = resp.body;
        });

        this.studentService.getCurrentAcademicYear().subscribe(resp => {
            if (resp.body) {
                this.currentAcademicYearId = resp.body.id;
            }
        });
    }

    onCampusChange(): void {
        const campusId = this.marksForm.get('campusId')?.value;
        this.standards = [];
        this.sections = [];
        this.exams = [];
        this.subjects = [];
        this.students = [];
        this.examMarks.clear();
        this.marksForm.patchValue({ standardId: '', sectionId: '', examId: '', subjectId: '' });

        if (campusId) {
            this.standardService.getStandardsByCampusId(campusId).subscribe(resp => {
                this.standards = resp.body;
            });
        }
    }

    onStandardChange(): void {
        const standardId = this.marksForm.get('standardId')?.value;
        this.sections = [];
        this.exams = [];
        this.subjects = [];
        this.students = [];
        this.examMarks.clear();
        this.marksForm.patchValue({ sectionId: '', examId: '', subjectId: '' });

        if (standardId) {
            this.standardService.getSectionsByStandardId(standardId).subscribe(resp => {
                this.sections = resp.body;
            });
        }
    }

    onSectionChange(): void {
        const sectionId = this.marksForm.get('sectionId')?.value;
        const standardId = this.marksForm.get('standardId')?.value;
        this.exams = [];
        this.subjects = [];
        this.students = [];
        this.examMarks.clear();
        this.marksForm.patchValue({ examId: '', subjectId: '' });

        if (sectionId && standardId && this.currentAcademicYearId) {
            this.service.searchExams({
                standardId: standardId,
                sectionId: sectionId,
                academicYearId: this.currentAcademicYearId
            }).subscribe(resp => {
                this.exams = resp.body;
            });
        }
    }

    onExamChange(): void {
        const examId = this.marksForm.get('examId')?.value;
        this.subjects = [];
        this.students = [];
        this.examMarks.clear();
        this.marksForm.patchValue({ subjectId: '' });

        if (examId) {
            this.service.getExamSubjects(examId).subscribe(resp => {
                this.subjects = resp.body;
            });
        }
    }

    onSubjectChange(): void {
        const subjectId = this.marksForm.get('subjectId')?.value;
        this.students = [];
        this.examMarks.clear();

        if (subjectId) {
            this.service.getStudentsForMarkEntry(subjectId).subscribe(resp => {
                this.students = resp.body;
                this.populateMarksArray();
            });
        }
    }

    private populateMarksArray(): void {
        this.examMarks.clear();
        this.students.forEach(student => {
            this.examMarks.push(this.fb.group({
                markId: [student.markId],
                studentId: [student.studentId],
                studentName: [student.studentName],
                studentCode: [student.studentCode],
                attendanceStatus: [student.attendanceStatus],
                obtainedMarks: [student.obtainedMarks, [Validators.min(0)]],
                graceMarks: [student.graceMarks || 0],
                remarks: [student.remarks || ''],
                locked: [student.locked || false],
                active: [student.attendanceStatus !== 'ABSENT']
            }));
        });
    }

    private loadMarksData(id: any): void {
        // Logic to load data for edit mode
    }

    onSubmit(): void {
        if (this.marksForm.invalid) {
            this.marksForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        const formValue = this.marksForm.value;
        const payload = formValue.examMarks.map((mark: any) => ({
            id: mark.markId,
            studentId: mark.studentId,
            examSubjectId: formValue.subjectId,
            academicYearId: this.currentAcademicYearId,
            obtainedMarks: mark.obtainedMarks,
            graceMarks: mark.graceMarks,
            remarks: mark.remarks,
            attendanceStatus: mark.attendanceStatus
        }));

        this.service.recordMarks(payload).subscribe({
            next: (resp: HttpResponse<any>) => {
                this.isLoading = false;
                this.router.navigate(ROUTES.STUDENT_EXAM_MARKS.LIST);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error saving marks:', err);
                this.isLoading = false;
            }
        });
    }

    cancel(): void {
        this.router.navigate(ROUTES.STUDENT_EXAM_MARKS.LIST);
    }
}
