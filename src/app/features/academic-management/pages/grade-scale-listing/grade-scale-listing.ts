import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject as RxSubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AcademicManagementService } from '../../services/academic-management.service';
import { GradeScale } from '../../models/academic.models';
import { Pagination } from '../../../../core/pagar/pagination';

@Component({
    selector: 'app-grade-scale-listing',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './grade-scale-listing.html'
})
export class GradeScaleListingPage implements OnInit, OnDestroy {
    grades: GradeScale[] = [];
    pagination: Pagination<GradeScale> = new Pagination([], 10);
    searchControl = new FormControl('');

    columns = [
        { key: 'grade', label: 'Grade' },
        { key: 'min', label: 'Min %' },
        { key: 'max', label: 'Max %' },
        { key: 'point', label: 'Grade Point' },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
    ];

    private destroy$ = new RxSubject<void>();

    constructor(private academicService: AcademicManagementService) { }

    ngOnInit(): void {
        this.loadGrades();
        this.subscribeToSearch();
    }

    private subscribeToSearch() {
        this.searchControl.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe(search => {
                const filtered = this.grades.filter(g =>
                    g.grade?.toLowerCase().includes(search?.toLowerCase() || '') ||
                    g.description?.toLowerCase().includes(search?.toLowerCase() || '')
                );
                this.pagination = new Pagination(filtered, this.pagination.pageSize);
            });
    }

    loadGrades() {
        this.academicService.getGradeScales().subscribe(resp => {
            this.grades = resp.body || [];
            this.pagination = new Pagination(this.grades, this.pagination.pageSize);
        });
    }

    onPageSizeChange(event: any) {
        this.pagination.changePageSize(+event.target.value);
    }

    openAddModal() {
        // Logic for adding grade
    }

    editGrade(grade: GradeScale, event: Event) {
        // Edit logic
    }

    deleteGrade(id: number | undefined, event: Event) {
        if (!id) return;
        event.stopPropagation();
        if (confirm('Delete this grade?')) {
            // delete logic
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
