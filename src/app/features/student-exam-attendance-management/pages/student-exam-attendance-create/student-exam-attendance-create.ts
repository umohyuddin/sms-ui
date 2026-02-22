import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentExamAttendanceManagementService } from '../../services/student-exam-attendance-management.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { SectionManagementService } from '../../../section-management/services/section-management.service';
import { StudentManagementService } from '../../../student-management/services/student-management.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-student-exam-attendance-create',
    templateUrl: './student-exam-attendance-create.html',
    styleUrls: ['./student-exam-attendance-create.css'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class StudentExamAttendanceCreate implements OnInit {
    attendanceForm!: FormGroup;
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
        private service: StudentExamAttendanceManagementService,
        private campusService: CampusManagementService,
        private standardService: StandardManagementService,
        private sectionService: SectionManagementService,
        private studentService: StudentManagementService
    ) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.id;
        this.initializeForm();
        this.loadInitialData();
        if (this.isEditMode) {
            this.loadAttendanceData(this.id);
        }
    }

    private initializeForm(): void {
        this.attendanceForm = this.fb.group({
            campusId: ['', Validators.required],
            standardId: ['', Validators.required],
            sectionId: ['', Validators.required],
            examId: ['', Validators.required],
            subjectId: ['', Validators.required],
            examAttendance: this.fb.array([])
        });
    }

    get examAttendance(): FormArray {
        return this.attendanceForm.get('examAttendance') as FormArray;
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
        const campusId = this.attendanceForm.get('campusId')?.value;
        this.standards = [];
        this.sections = [];
        this.exams = [];
        this.subjects = [];
        this.students = [];
        this.examAttendance.clear();
        this.attendanceForm.patchValue({ standardId: '', sectionId: '', examId: '', subjectId: '' });

        if (campusId) {
            this.standardService.getStandardsByCampusId(campusId).subscribe(resp => {
                this.standards = resp.body;
            });
        }
    }

    onStandardChange(): void {
        const standardId = this.attendanceForm.get('standardId')?.value;
        this.sections = [];
        this.exams = [];
        this.subjects = [];
        this.students = [];
        this.examAttendance.clear();
        this.attendanceForm.patchValue({ sectionId: '', examId: '', subjectId: '' });

        if (standardId) {
            this.standardService.getSectionsByStandardId(standardId).subscribe(resp => {
                this.sections = resp.body;
            });
        }
    }

    onSectionChange(): void {
        const sectionId = this.attendanceForm.get('sectionId')?.value;
        const standardId = this.attendanceForm.get('standardId')?.value;
        this.exams = [];
        this.subjects = [];
        this.students = [];
        this.examAttendance.clear();
        this.attendanceForm.patchValue({ examId: '', subjectId: '' });

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
        const examId = this.attendanceForm.get('examId')?.value;
        this.subjects = [];
        this.students = [];
        this.examAttendance.clear();
        this.attendanceForm.patchValue({ subjectId: '' });

        if (examId) {
            this.service.getExamSubjects(examId).subscribe(resp => {
                this.subjects = resp.body;
            });
        }
    }

    onSubjectChange(): void {
        const subjectId = this.attendanceForm.get('subjectId')?.value;
        const sectionId = this.attendanceForm.get('sectionId')?.value;
        this.students = [];
        this.examAttendance.clear();

        if (subjectId && sectionId) {
            this.studentService.searchStudents({ sectionId: sectionId }).subscribe(resp => {
                this.students = resp.body;
                this.populateAttendanceArray();
            });
        }
    }

    private populateAttendanceArray(): void {
        this.examAttendance.clear();
        this.students.forEach(student => {
            this.examAttendance.push(this.fb.group({
                studentId: [student.id],
                studentName: [student.fullName || student.studentName],
                rollNumber: [student.rollNumber],
                isPresent: [true], // Default to Present
                remarks: [''],
                active: [true]
            }));
        });
    }

    private loadAttendanceData(id: any): void {
        // Logic to load data for edit mode
    }

    onSubmit(): void {
        if (this.attendanceForm.invalid) {
            this.attendanceForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        const formValue = this.attendanceForm.value;
        const payload = {
            examId: formValue.examId,
            subjectId: formValue.subjectId,
            academicYearId: this.currentAcademicYearId,
            attendanceRecords: formValue.examAttendance
        };

        this.service.recordAttendance(payload).subscribe({
            next: (resp: HttpResponse<any>) => {
                this.isLoading = false;
                this.router.navigate(ROUTES.STUDENT_EXAM_ATTENDANCE.LIST);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error saving attendance:', err);
                this.isLoading = false;
            }
        });
    }

    cancel(): void {
        this.router.navigate(ROUTES.STUDENT_EXAM_ATTENDANCE.LIST);
    }
}
