import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject as RxSubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AcademicManagementService } from '../../services/academic-management.service';
import { TeacherAssignment } from '../../models/academic.models';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { Pagination } from '../../../../core/pagar/pagination';

@Component({
    selector: 'app-teacher-assignment-listing',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './teacher-assignment-listing.html'
})
export class TeacherAssignmentListing implements OnInit, OnDestroy {
    assignments: TeacherAssignment[] = [];
    standards: any[] = [];
    sections: any[] = [];
    filters = { standardId: '', sectionId: '', academicYearId: 1 };

    pagination: Pagination<TeacherAssignment> = new Pagination([], 10);
    searchControl = new FormControl('');
    columns = [
        { key: 'teacher', label: 'Teacher' },
        { key: 'subject', label: 'Subject' },
        { key: 'standard', label: 'Standard' },
        { key: 'section', label: 'Section' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
    ];

    private destroy$ = new RxSubject<void>();

    constructor(private academicService: AcademicManagementService, private router: Router) { }

    ngOnInit(): void {
        this.loadAssignments();
        this.subscribeToSearch();
    }

    private subscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe(search => {
                const filtered = this.assignments.filter(a =>
                    a.employeeName?.toLowerCase().includes(search?.toLowerCase() || '') ||
                    a.subjectName?.toLowerCase().includes(search?.toLowerCase() || '')
                );
                this.pagination = new Pagination(filtered, this.pagination.pageSize);
            });
    }

    loadAssignments() {
        if (this.filters.standardId && this.filters.sectionId) {
            this.academicService.getSectionAssignments(this.filters.standardId, this.filters.sectionId, this.filters.academicYearId).subscribe(resp => {
                this.assignments = resp.body || [];
                this.pagination = new Pagination(this.assignments, this.pagination.pageSize);
            });
        }
    }

    onPageSizeChange(event: any) {
        this.pagination.changePageSize(+event.target.value);
    }

    goToCreateAssignment() {
        this.router.navigate(ROUTES.ACADEMIC.MAPPING.TEACHER_ASSIGNMENT);
    }

    editAssignment(a: TeacherAssignment, event: Event) {
        // Edit logic
    }

    deleteAssignment(id: number | undefined, event: Event) {
        if (!id) return;
        event.stopPropagation();
        if (confirm('Delete this assignment?')) {
            this.academicService.deleteTimetable(id).subscribe(() => this.loadAssignments()); // Adjust service call if needed
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
