import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicManagementService } from '../../services/academic-management.service';
import { Subject, StandardSubject } from '../../models/academic.models';

@Component({
    selector: 'app-standard-subject-assignment',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-6">Standard-Subject Assignment</h2>
      
      <div class="flex gap-4 mb-6 bg-white p-4 rounded shadow">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700">Standard</label>
          <select [(ngModel)]="selectedStandardId" class="mt-1 block w-full border-gray-300 rounded shadow-sm">
            <option value="1">Standard 1</option>
            <option value="2">Standard 2</option>
          </select>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700">Academic Year</label>
          <select [(ngModel)]="selectedYearId" class="mt-1 block w-full border-gray-300 rounded shadow-sm">
            <option value="1">2024-25</option>
          </select>
        </div>
        <div class="flex items-end">
          <button (click)="loadAssignments()" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Fetch</button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8">
        <div class="bg-white p-4 shadow rounded">
          <h3 class="font-bold mb-3 border-b">Available Subjects</h3>
          <div *ngFor="let s of allSubjects" class="flex justify-between items-center py-2 border-sm">
            <span>{{ s.name }}</span>
            <button (click)="assign(s)" class="text-blue-600 hover:text-blue-800 text-sm">Assign</button>
          </div>
        </div>

        <div class="bg-white p-4 shadow rounded">
          <h3 class="font-bold mb-3 border-b">Assigned Subjects</h3>
          <div *ngFor="let a of assignedSubjects" class="flex justify-between items-center py-2 border-sm">
            <span>{{ a.subjectName }}</span>
            <button (click)="unassign(a)" class="text-red-600 hover:text-red-800 text-sm">Remove</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StandardSubjectAssignment implements OnInit {
    selectedStandardId = 1;
    selectedYearId = 1;
    allSubjects: Subject[] = [];
    assignedSubjects: StandardSubject[] = [];

    constructor(private academicService: AcademicManagementService) { }

    ngOnInit(): void {
        this.academicService.getSubjects().subscribe(resp => this.allSubjects = resp.body);
    }

    loadAssignments(): void {
        this.academicService.getStandardSubjects(this.selectedStandardId, this.selectedYearId).subscribe(resp => {
            this.assignedSubjects = resp.body;
        });
    }

    assign(subject: Subject): void {
        const payload = {
            standardId: this.selectedStandardId,
            subjectId: subject.id,
            academicYearId: this.selectedYearId,
            isMandatory: true
        };
        this.academicService.assignSubjectToStandard(payload).subscribe(() => this.loadAssignments());
    }

    unassign(assignment: StandardSubject): void {
        // Unassign logic...
    }
}
