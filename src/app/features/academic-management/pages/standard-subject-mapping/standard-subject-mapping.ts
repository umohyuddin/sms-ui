import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicManagementService } from '../../services/academic-management.service';
import { Subject, StandardSubject } from '../../models/academic.models';

@Component({
    selector: 'app-standard-subject-mapping',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './standard-subject-mapping.html',
    styleUrls: ['./standard-subject-mapping.css']
})
export class StandardSubjectMapping implements OnInit {
    academicYears: any[] = [{ id: 1, yearName: '2024-25' }]; // Placeholder
    standards: any[] = [{ id: 1, standardName: 'Standard 1' }]; // Placeholder

    selectedYearId: number | null = null;
    selectedStandardId: number | null = null;

    allSubjects: Subject[] = [];
    assignedSubjects: StandardSubject[] = [];
    availableSubjects: Subject[] = [];

    constructor(private academicService: AcademicManagementService) { }

    ngOnInit(): void {
        this.loadInitialData();
    }

    loadInitialData() {
        this.academicService.getSubjects().subscribe(resp => {
            this.allSubjects = resp.body || [];
            this.filterAvailable();
        });
        // TODO: Load academic years and standards from respective services
    }

    onFilterChange() {
        if (this.selectedYearId && this.selectedStandardId) {
            this.loadAssignments();
        }
    }

    loadAssignments() {
        this.academicService.getStandardSubjects(this.selectedStandardId!, this.selectedYearId!).subscribe(resp => {
            this.assignedSubjects = resp.body || [];
            this.filterAvailable();
        });
    }

    filterAvailable() {
        const assignedIds = this.assignedSubjects.map(a => a.subjectId);
        this.availableSubjects = this.allSubjects.filter(s => !assignedIds.includes(s.id!));
    }

    assign(subject: Subject) {
        const payload = {
            standardId: this.selectedStandardId,
            subjectId: subject.id,
            academicYearId: this.selectedYearId,
            isMandatory: true
        };
        this.academicService.assignSubjectToStandard(payload).subscribe(() => this.loadAssignments());
    }

    unassign(assignment: StandardSubject) {
        if (confirm('Are you sure you want to remove this subject from the standard?')) {
            this.academicService.unassignSubjectFromStandard(assignment.standardId, assignment.subjectId, assignment.academicYearId).subscribe(() => this.loadAssignments());
        }
    }
}
