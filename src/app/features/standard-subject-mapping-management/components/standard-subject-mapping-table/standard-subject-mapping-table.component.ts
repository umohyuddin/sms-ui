import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject as RxSubject, takeUntil, Observable, forkJoin } from 'rxjs';
import { StandardSubjectMappingService } from '../../services/standard-subject-mapping.service';
import { Subject, StandardSubject, Campus, Standard, AcademicYear, StandardSubjectRequest } from '../../models/standard-subject-mapping.model';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
    selector: 'app-standard-subject-mapping-table',
    standalone: true,
    imports: [CommonModule, FormsModule, LoaderComponent, DeletePopupComponent, ToasterComponent],
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
    selectedAssignedIds: Set<number> = new Set();
    selectedAvailableIds: Set<number> = new Set();

    loading = false;
    loaderMessage = '';
    showDeletePopup = false;
    deletePopupTitle = '';
    deletePopupMessage = '';
    pendingUnassign: StandardSubject | null = null;
    pendingBulkUnassign: number[] | null = null;

    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

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
        this.loading = true;
        this.loaderMessage = 'Loading assignments...';
        this.mappingService.getStandardSubjects(this.selectedStandardId!, this.selectedYearId!)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: resp => {
                    this.assignedSubjects = resp.body || [];
                    this.selectedAssignedIds.clear(); // Clear selection when data is reloaded
                    this.selectedAvailableIds.clear(); // Clear selection when data is reloaded
                    this.filterAvailable();
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                    this.toaster.show('Failed to load assignments', 'error');
                }
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
        this.loading = true;
        this.loaderMessage = 'Assigning subject...';
        this.mappingService.assignSubject(payload).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.toaster.show('Subject assigned successfully', 'success');
                this.loadAssignments();
            },
            error: () => {
                this.loading = false;
                this.toaster.show('Failed to assign subject', 'error');
            }
        });
    }

    bulkAssign(): void {
        if (this.selectedAvailableIds.size === 0) return;

        const assignments = Array.from(this.selectedAvailableIds).map(subjectId => {
            const subject = this.allSubjects.find(s => s.id === subjectId);
            return {
                standardId: this.selectedStandardId!,
                subjectId: subjectId,
                academicYearId: this.selectedYearId!,
                optional: subject?.isElective || false,
                weeklyHours: 0,
                theoryMarks: 100,
                practicalMarks: 0,
                active: true
            };
        });

        this.loading = true;
        this.mappingService.bulkAssignSubjects({ assignments }).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.toaster.show(`${assignments.length} subjects assigned successfully`, 'success');
                this.loadAssignments();
            },
            error: () => {
                this.loading = false;
                this.toaster.show('Failed to assign subjects', 'error');
            }
        });
    }

    assignAll(): void {
        if (this.filteredAvailable.length === 0) return;

        const assignments = this.filteredAvailable.map(subject => {
            return {
                standardId: this.selectedStandardId!,
                subjectId: subject.id!,
                academicYearId: this.selectedYearId!,
                optional: subject.isElective || false,
                weeklyHours: 0,
                theoryMarks: 100,
                practicalMarks: 0,
                active: true
            };
        });

        this.loading = true;
        this.mappingService.bulkAssignSubjects({ assignments }).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.toaster.show(`All ${assignments.length} subjects assigned successfully`, 'success');
                this.loadAssignments();
            },
            error: () => {
                this.loading = false;
                this.toaster.show('Failed to assign all subjects', 'error');
            }
        });
    }

    unassign(assignment: StandardSubject): void {
        this.pendingUnassign = assignment;
        this.pendingBulkUnassign = null;
        this.deletePopupTitle = 'Unassign Subject';
        this.deletePopupMessage = `Are you sure you want to remove ${assignment.subjectName} from this standard?`;
        this.showDeletePopup = true;
    }

    bulkUnassign(): void {
        if (this.selectedAssignedIds.size === 0) return;

        this.pendingUnassign = null;
        this.pendingBulkUnassign = Array.from(this.selectedAssignedIds);
        this.deletePopupTitle = 'Bulk Unassign Subjects';
        this.deletePopupMessage = `Are you sure you want to remove ${this.selectedAssignedIds.size} selected subjects?`;
        this.showDeletePopup = true;
    }

    confirmUnassign(): void {
        if (this.pendingUnassign) {
            this.loading = true;
            this.loaderMessage = 'Unassigning subject...';
            this.mappingService.unassignSubject(this.pendingUnassign.standardId, this.pendingUnassign.subjectId, this.pendingUnassign.academicYearId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.toaster.show('Subject unassigned successfully', 'success');
                        this.loadAssignments();
                    },
                    error: () => {
                        this.loading = false;
                        this.toaster.show('Failed to unassign subject', 'error');
                    }
                });
        } else if (this.pendingBulkUnassign) {
            this.loading = true;
            this.loaderMessage = 'Performing bulk unassignment...';
            this.mappingService.bulkUnassignSubjects(this.selectedStandardId!, this.pendingBulkUnassign, this.selectedYearId!)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.toaster.show(`${this.pendingBulkUnassign!.length} subjects unassigned successfully`, 'success');
                        this.loadAssignments();
                    },
                    error: () => {
                        this.loading = false;
                        this.toaster.show('Failed to unassign subjects', 'error');
                    }
                });
        }
        this.showDeletePopup = false;
    }

    cancelUnassign(): void {
        this.showDeletePopup = false;
        this.pendingUnassign = null;
        this.pendingBulkUnassign = null;
    }

    toggleSubjectSelection(subjectId: number): void {
        if (this.selectedAssignedIds.has(subjectId)) {
            this.selectedAssignedIds.delete(subjectId);
        } else {
            this.selectedAssignedIds.add(subjectId);
        }
    }

    toggleAllAssigned(isSelected: boolean): void {
        if (isSelected) {
            this.filteredAssigned.forEach(a => this.selectedAssignedIds.add(a.subjectId));
        } else {
            this.selectedAssignedIds.clear();
        }
    }

    toggleAvailableSelection(subjectId: number): void {
        if (this.selectedAvailableIds.has(subjectId)) {
            this.selectedAvailableIds.delete(subjectId);
        } else {
            this.selectedAvailableIds.add(subjectId);
        }
    }

    toggleAllAvailable(isSelected: boolean): void {
        if (isSelected) {
            this.filteredAvailable.forEach(s => this.selectedAvailableIds.add(s.id!));
        } else {
            this.selectedAvailableIds.clear();
        }
    }

    isAllAvailableSelected(): boolean {
        return this.filteredAvailable.length > 0 && this.filteredAvailable.every(s => this.selectedAvailableIds.has(s.id!));
    }

    isAllAssignedSelected(): boolean {
        return this.filteredAssigned.length > 0 && this.filteredAssigned.every(a => this.selectedAssignedIds.has(a.subjectId));
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
        this.loading = true;
        this.loaderMessage = assignment.id ? 'Updating assignment...' : 'Assigning subject...';

        const request = assignment.id
            ? this.mappingService.updateStandardSubjectMapping(assignment.id, payload)
            : this.mappingService.assignSubject(payload);

        request.pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                const message = assignment.id ? 'Assignment updated successfully' : 'Subject assigned successfully';
                this.toaster.show(message, 'success');
                this.loadAssignments();
            },
            error: () => {
                this.loading = false;
                const message = assignment.id ? 'Failed to update assignment' : 'Failed to assign subject';
                this.toaster.show(message, 'error');
            }
        });
    }

    saveAll(): void {
        if (!this.assignedSubjects.length) return;

        // Note: For now, we perform separate calls for updates if they have IDs, 
        // or a bulk call for assign. A bulk update endpoint would be better.
        const updateTasks: Observable<any>[] = [];
        const newAssignments: any[] = [];

        this.assignedSubjects.forEach(assignment => {
            const payload = {
                standardId: assignment.standardId,
                subjectId: assignment.subjectId,
                academicYearId: assignment.academicYearId,
                optional: assignment.optional,
                weeklyHours: assignment.weeklyHours,
                theoryMarks: assignment.theoryMarks,
                practicalMarks: assignment.practicalMarks,
                active: assignment.active ?? true
            };

            if (assignment.id) {
                updateTasks.push(this.mappingService.updateStandardSubjectMapping(assignment.id, payload));
            } else {
                newAssignments.push(payload);
            }
        });

        this.loading = true;
        this.loaderMessage = 'Saving all assignments...';

        // If your backend bulkAssign actually handles updates (upsert), you can just use bulkAssign.
        // Otherwise, this approach handles both.
        if (newAssignments.length > 0) {
            updateTasks.push(this.mappingService.bulkAssignSubjects({ assignments: newAssignments }));
        }

        if (updateTasks.length === 0) {
            this.loading = false;
            return;
        }

        forkJoin(updateTasks).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.toaster.show('All assignments saved successfully', 'success');
                this.loadAssignments();
            },
            error: () => {
                this.loading = false;
                this.toaster.show('Failed to save some assignments', 'error');
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
