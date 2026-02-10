import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicManagementService } from '../../services/academic-management.service';

@Component({
    selector: 'app-exam-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-6">Exam & Assessment Management</h2>
      
      <div class="bg-white p-4 rounded shadow mb-6">
        <h3 class="font-bold mb-2">Configure Exams</h3>
        <div class="flex gap-4">
            <select [(ngModel)]="selectedYearId" class="border rounded px-2 py-1">
                <option value="1">2024-25</option>
            </select>
            <button (click)="loadExams()" class="bg-blue-600 text-white px-4 py-1 rounded">Load Exams</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div *ngFor="let exam of exams" class="bg-white p-4 rounded shadow border-l-4 border-blue-500">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="text-lg font-bold">{{ exam.name }}</h4>
                    <p class="text-sm text-gray-500">{{ exam.startDate }} to {{ exam.endDate }}</p>
                </div>
                <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{{ exam.status }}</span>
            </div>
            <div class="mt-4">
                <h5 class="text-sm font-semibold mb-2">Scheduled Subjects:</h5>
                <ul class="text-sm">
                    <li *ngFor="let s of exam.subjects" class="flex justify-between py-1 border-t">
                        <span>{{ s.subjectName }}</span>
                        <span>{{ s.examDate }} @ {{ s.startTime }}</span>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  `
})
export class ExamManagementPage implements OnInit {
    selectedYearId = 1;
    exams: any[] = [];

    constructor(private academicService: AcademicManagementService) { }

    ngOnInit(): void {
        this.loadExams();
    }

    loadExams(): void {
        this.academicService.getExamsBySection(1, 1, this.selectedYearId).subscribe(resp => {
            this.exams = resp.body;
        });
    }
}
