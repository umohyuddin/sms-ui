import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject as RxSubject, takeUntil } from 'rxjs';
import { StandardSubjectMappingService } from '../../services/standard-subject-mapping.service';
import { Subject, StandardSubject, Campus, Standard, AcademicYear, StandardSubjectRequest } from '../../models/standard-subject-mapping.model';

@Component({
    selector: 'app-standard-subject-mapping-table',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './standard-subject-mapping-table.component.html',
    styleUrls: ['./standard-subject-mapping-table.component.css']
})
export class StandardSubjectMappingTableComponent implements OnInit, OnDestroy {
    campuses: Campus[] = [];
    standards: Standard[] = [];
    academicYears: AcademicYear[] = [];

    selectedCampusId: number | null = null;
    selectedYearId: number | null = null;
    selectedStandardId: number | null = null;

    allSubjects: Subject[] = [];
    assignedSubjects: StandardSubject[] = [];
    availableSubjects: Subject[] = [];

    filteredAssigned: StandardSubject[] = [];
    filteredAvailable: Subject[] = [];

    megaSearchTerm: string = '';

    get mandatoryCount(): number {
        return this.assignedSubjects.filter(a => a.isMandatory).length;
    }

    get electiveCount(): number {
        return this.assignedSubjects.filter(a => !a.isMandatory).length;
    }

    get availablePercent(): number {
        if (!this.allSubjects.length) return 0;
        return (this.availableSubjects.length / this.allSubjects.length) * 100;
    }

    get assignedPercent(): number {
        if (!this.allSubjects.length) return 0;
        return (this.assignedSubjects.length / this.allSubjects.length) * 100;
    }

    get mandatoryPercent(): number {
        if (!this.assignedSubjects.length) return 0;
        return (this.mandatoryCount / this.assignedSubjects.length) * 100;
    }

    get electivePercent(): number {
        if (!this.assignedSubjects.length) return 0;
        return (this.electiveCount / this.assignedSubjects.length) * 100;
    }

    private destroy$ = new RxSubject<void>();

    constructor(private mappingService: StandardSubjectMappingService) { }

    ngOnInit(): void {

        this.loadInitialData();
    }

    loadInitialData(): void {
        this.mappingService.getCampuses().pipe(takeUntil(this.destroy$)).subscribe(resp => {
            this.campuses = resp.body || [];
        });

        this.mappingService.getAcademicYears().pipe(takeUntil(this.destroy$)).subscribe(resp => {
            this.academicYears = resp.body || [];
            const currentYear = this.academicYears.find(y => y.isCurrent);
            if (currentYear) {
                this.selectedYearId = currentYear.id;
                this.onFilterChange();
            }
        });

        this.mappingService.getSubjects().pipe(takeUntil(this.destroy$)).subscribe(resp => {
            this.allSubjects = resp.body || [];
        });
    }

    onCampusChange(): void {
        this.selectedStandardId = null;
        this.standards = [];
        if (this.selectedCampusId) {
            this.mappingService.getStandardsByCampus(this.selectedCampusId.toString())
                .pipe(takeUntil(this.destroy$))
                .subscribe(resp => {
                    this.standards = resp.body || [];
                });
        }
        this.onFilterChange();
    }

    onFilterChange(): void {
        if (this.selectedYearId && this.selectedStandardId) {
            this.loadAssignments();
        } else {
            this.assignedSubjects = [];
            this.availableSubjects = [];
            this.applyMegaSearch();
        }
    }

    loadAssignments(): void {
        this.mappingService.getStandardSubjects(this.selectedStandardId!, this.selectedYearId!)
            .pipe(takeUntil(this.destroy$))
            .subscribe(resp => {
                this.assignedSubjects = resp.body || [];
                this.filterAvailable();
            });
    }

    filterAvailable(): void {
        const assignedIds = this.assignedSubjects.map(a => a.subjectId);
        this.availableSubjects = this.allSubjects.filter(s => !assignedIds.includes(s.id!));
        this.applyMegaSearch();
    }

    onMegaSearch(): void {
        this.applyMegaSearch();
    }

    applyMegaSearch(): void {
        const term = this.megaSearchTerm.toLowerCase().trim();
        if (!term) {
            this.filteredAssigned = [...this.assignedSubjects];
            this.filteredAvailable = [...this.availableSubjects];
            return;
        }

        this.filteredAssigned = this.assignedSubjects.filter(a =>
            a.subjectName?.toLowerCase().includes(term)
        );

        this.filteredAvailable = this.availableSubjects.filter(s =>
            s.name.toLowerCase().includes(term) || s.code.toLowerCase().includes(term)
        );
    }

    assign(subject: Subject): void {
        const payload: StandardSubjectRequest = {
            standardId: this.selectedStandardId!,
            subjectId: subject.id!,
            academicYearId: this.selectedYearId!,
            optional: subject.isElective || false,
            weeklyHours: 0,
            theoryMarks: 100,
            practicalMarks: 0,
            active: true
        };
        this.mappingService.assignSubject(payload).pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.loadAssignments();
        });
    }

    unassign(assignment: StandardSubject): void {
        if (confirm(`Are you sure you want to remove ${assignment.subjectName} from this standard?`)) {
            this.mappingService.unassignSubject(assignment.standardId, assignment.subjectId, assignment.academicYearId)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    this.loadAssignments();
                });
        }
    }

    saveAssignment(assignment: StandardSubject): void {
        const payload: StandardSubjectRequest = {
            standardId: assignment.standardId,
            subjectId: assignment.subjectId,
            academicYearId: assignment.academicYearId,
            optional: assignment.optional,
            weeklyHours: assignment.weeklyHours,
            theoryMarks: assignment.theoryMarks,
            practicalMarks: assignment.practicalMarks,
            active: assignment.active ?? true
        };
        this.mappingService.assignSubject(payload).pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.loadAssignments();
        });
    }

    saveAll(): void {
        if (!this.assignedSubjects.length) return;

        // In a real app, we'd use forkJoin or a bulk endpoint
        // For now, let's just save the current state
        this.assignedSubjects.forEach(assignment => this.saveAssignment(assignment));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
