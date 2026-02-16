import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject as RxSubject, debounceTime, distinctUntilChanged, takeUntil, forkJoin } from 'rxjs';
import { AcademicManagementService } from '../../../academic-management/services/academic-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { SectionManagementService } from '../../../section-management/services/section-management.service';
import { SubjectManagementService } from '../../../subject-management/services/subject-management.service';
import { EmployeeManagementService } from '../../../employee-management/services/employee-management.service';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { SectionResponse } from '../../../section-management/models/SectionResponse';
import { Subject } from '../../../subject-management/models/subject.model';
import { EmployeeResponse } from '../../../employee-management/models/EmployeeResponse';
import { TeacherAssignment } from '../../../academic-management/models/academic.models';
import { Pagination } from '../../../../core/pagar/pagination';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
    selector: 'app-teacher-assignment-listing',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent],
    templateUrl: './teacher-assignment-listing.html',
    styleUrls: ['./teacher-assignment-listing.css']
})
export class TeacherAssignmentListing implements OnInit, OnDestroy {
    assignments: TeacherAssignment[] = [];
    academicYears: AcademicYearResponse[] = [];
    campuses: CampusResponse[] = [];
    standards: StandardResponse[] = [];
    sections: SectionResponse[] = [];
    selectedCampusId: any = '';
    selectedStandardId: any = '';
    selectedYearId: any = '';
    selectedTeacherId: any = '';

    teachers: EmployeeResponse[] = [];
    filteredTeachers: EmployeeResponse[] = [];
    teacherSearchTerm: string = '';
    isTeacherDropdownOpen = false;


    loading = false;
    loaderMessage = '';

    matrixRecords: any[] = [];
    standardSubjects: any[] = [];



    columns = [
        { key: 'employeeName', label: 'Teacher' },
        { key: 'subjectName', label: 'Subject' },
        { key: 'standardName', label: 'Standard' },
        { key: 'sectionName', label: 'Section' },
        { key: 'effectiveFrom', label: 'Effective Date' },
        { key: 'actions', label: 'Actions' }
    ];

    private destroy$ = new RxSubject<void>();

    constructor(
        private academicService: AcademicManagementService,
        private yearService: AcademicYearManagementService,
        private campusService: CampusManagementService,
        private standardService: StandardManagementService,
        private sectionService: SectionManagementService,
        private subjectService: SubjectManagementService,
        private employeeService: EmployeeManagementService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadInitialData();
        this.loadAssignments();
    }

    loadInitialData(): void {
        this.loading = true;
        this.loaderMessage = 'Loading initial data...';

        forkJoin({
            years: this.yearService.getAcademicYears(),
            campuses: this.campusService.getAllCampuses(),
            teachers: this.employeeService.getAllEmployee()
        }).pipe(takeUntil(this.destroy$)).subscribe({
            next: (resp: any) => {
                this.academicYears = resp.years.body || [];
                this.campuses = resp.campuses.body || [];
                this.teachers = resp.teachers.body || [];

                const currentYear = this.academicYears.find(y => y.isCurrent);
                if (currentYear) {
                    this.selectedYearId = currentYear.id;
                }
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    onCampusChange(): void {
        if (!this.selectedCampusId) {
            this.standards = [];
            this.sections = [];
            this.selectedStandardId = '';
            return;
        }

        this.loading = true;
        this.loaderMessage = 'Loading standards...';
        this.standardService.getStandardsByCampusId(this.selectedCampusId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (resp: any) => {
                this.standards = resp.body || [];
                this.sections = [];
                this.selectedStandardId = '';
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    onStandardChange(): void {
        if (!this.selectedStandardId) {
            this.sections = [];
            this.standardSubjects = [];
            this.matrixRecords = [];
            return;
        }

        this.loading = true;
        this.loaderMessage = 'Loading sections and subjects...';

        forkJoin({
            sections: this.sectionService.getSectionByStandardId(this.selectedStandardId),
            subjects: this.academicService.getStandardSubjects(this.selectedStandardId, this.selectedYearId),
            allAssignments: this.academicService.getStandardAssignments(this.selectedStandardId, this.selectedYearId)
        }).pipe(takeUntil(this.destroy$)).subscribe({
            next: (resp: any) => {
                this.sections = resp.sections.body || [];
                this.standardSubjects = resp.subjects.body || [];
                this.assignments = resp.allAssignments.body || [];
                this.buildMatrix(); // Show subjects with "Not Assigned" initially
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }


    onRowSectionChange(record: any, sectionId: number): void {
        const assignment = this.assignments.find(a =>
            Number(a.subjectId) === Number(record.subjectId) &&
            Number(a.sectionId) === Number(sectionId)
        );

        const section = this.sections.find(s => Number(s.id) === Number(sectionId));
        const sectionName = section ? section.sectionName : '';

        // Store cell-specific data in a map within the record
        if (!record.cells) record.cells = {};

        record.cells[sectionId] = {
            sectionId: sectionId,
            sectionName: sectionName,
            assignedTeacherId: assignment ? assignment.employeeId : null,
            assignedTeacherName: assignment ? assignment.employeeName : 'Not Assigned',
            assignmentId: assignment ? assignment.id : null,
            effectiveFrom: assignment ? assignment.effectiveFrom : null,
            isDropdownOpen: false,
            searchTerm: '',
            filteredTeachers: [...this.teachers]
        };
    }

    loadAssignments() {
        if (this.selectedStandardId && this.selectedYearId) {
            this.loading = true;
            this.loaderMessage = 'Refreshing assignments...';
            this.academicService.getStandardAssignments(this.selectedStandardId, this.selectedYearId)
                .pipe(takeUntil(this.destroy$)).subscribe({
                    next: (resp: any) => {
                        this.assignments = resp.body || [];
                        // Refresh each cell in the matrix
                        this.matrixRecords.forEach(record => {
                            this.sections.forEach(sec => this.onRowSectionChange(record, sec.id));
                        });
                        this.loading = false;
                    },
                    error: () => {
                        this.loading = false;
                    }
                });
        }
    }

    buildMatrix() {
        if (!this.sections.length || !this.standardSubjects.length) return;

        this.matrixRecords = this.standardSubjects.map(ss => {
            const record = {
                subjectId: ss.subjectId,
                subjectName: ss.subjectName,
                cells: {} as any
            };

            // Initialize data for each section column
            this.sections.forEach(sec => {
                this.onRowSectionChange(record, sec.id);
            });

            return record;
        });
    }

    onMatrixTeacherSearch(cell: any): void {
        const term = cell.searchTerm.toLowerCase();
        cell.filteredTeachers = this.teachers.filter(t =>
            t.fullName?.toLowerCase().includes(term) ||
            t.employeeCode?.toLowerCase().includes(term)
        );
    }

    assignTeacherToSubject(record: any, teacher: any, sectionId: number): void {
        if (!teacher) return;

        const payload = {
            employeeId: teacher.id,
            standardId: this.selectedStandardId,
            sectionId: sectionId,
            subjectId: record.subjectId,
            academicYearId: this.selectedYearId,
            effectiveFrom: new Date().toISOString().split('T')[0],
            teachingRole: "PRIMARY",
            active: true
        };

        this.loading = true;
        this.loaderMessage = 'Saving assignment...';
        this.academicService.assignTeacher(payload).subscribe({
            next: () => {
                this.loadAssignments();
                alert(`Teacher ${teacher.fullName} assigned to ${record.subjectName}`);
            },
            error: (err) => {
                this.loading = false;
                console.error('Error saving assignment:', err);
                alert('Failed to save assignment.');
            }
        });
    }


    resetFilters() {
        this.selectedStandardId = '';
        this.selectedCampusId = '';
        this.matrixRecords = [];
    }


    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.custom-searchable-dropdown')) {
            this.isTeacherDropdownOpen = false;
            // Close all matrix dropdowns across all cells
            this.matrixRecords.forEach(record => {
                if (record.cells) {
                    Object.values(record.cells).forEach((cell: any) => cell.isDropdownOpen = false);
                }
            });
        }
    }


    goToCreateAssignment() {
        this.router.navigate(ROUTES.ACADEMIC.MAPPING.TEACHER_ASSIGNMENT);
    }

    editAssignment(a: TeacherAssignment, event: Event) {
        // Edit logic
    }

    deleteAssignment(record: any, sectionId: number, event: Event) {
        const cell = record.cells[sectionId];
        if (!cell || !cell.assignmentId) return;
        event.stopPropagation();
        if (confirm(`Remove teacher ${cell.assignedTeacherName} from ${record.subjectName} in Section ${cell.sectionName}?`)) {
            const params = {
                standardId: this.selectedStandardId,
                sectionId: sectionId,
                subjectId: record.subjectId,
                employeeId: cell.assignedTeacherId,
                academicYearId: this.selectedYearId
            };
            this.academicService.unassignTeacher(params).subscribe({
                next: () => {
                    this.loadAssignments();
                    alert('Assignment removed successfully.');
                },
                error: (err) => {
                    console.error('Error deleting assignment:', err);
                    alert('Failed to remove assignment.');
                }
            });
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
