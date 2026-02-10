import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicManagementService } from '../../services/academic-management.service';

@Component({
    selector: 'app-results-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-6">Results & Marks Entry</h2>
      
      <div class="bg-white p-4 rounded shadow mb-6 flex gap-4">
        <div class="flex-1">
            <label class="block text-sm font-medium">Exam</label>
            <select [(ngModel)]="selectedExamId" class="w-full border rounded px-2 py-1">
                <option value="1">Final Term 2024</option>
            </select>
        </div>
        <div class="flex-1">
            <label class="block text-sm font-medium">Subject</label>
            <select [(ngModel)]="selectedSubjectId" class="w-full border rounded px-2 py-1">
                <option value="1">Mathematics</option>
            </select>
        </div>
        <div class="flex items-end">
            <button class="bg-indigo-600 text-white px-4 py-1 rounded">Load Marks Sheet</button>
        </div>
      </div>

      <div class="bg-white shadow rounded overflow-hidden">
          <table class="min-w-full">
              <thead class="bg-gray-100 font-bold">
                  <tr>
                      <th class="px-4 py-2 text-left">Roll No</th>
                      <th class="px-4 py-2 text-left">Student Name</th>
                      <th class="px-4 py-2 text-center w-32">Obtained Marks</th>
                      <th class="px-4 py-2 text-left">Remarks</th>
                  </tr>
              </thead>
              <tbody>
                  <tr *ngFor="let s of markSheet" class="border-t">
                      <td class="px-4 py-2 text-sm">{{ s.rollNo }}</td>
                      <td class="px-4 py-2 text-sm">{{ s.name }}</td>
                      <td class="px-4 py-2 text-center">
                          <input type="number" [(ngModel)]="s.obtainedMarks" class="w-20 border rounded px-2 py-1 text-center">
                      </td>
                      <td class="px-4 py-2 text-sm">
                          <input type="text" [(ngModel)]="s.remarks" class="w-full border rounded px-2 py-1">
                      </td>
                  </tr>
              </tbody>
          </table>
          <div class="p-4 bg-gray-50 text-right">
              <button (click)="saveMarks()" class="bg-green-600 text-white px-6 py-2 rounded shadow">Submit Marks</button>
          </div>
      </div>
    </div>
  `
})
export class ResultsManagementPage implements OnInit {
    selectedExamId = 1;
    selectedSubjectId = 1;
    markSheet: any[] = [
        { id: 1, rollNo: '101', name: 'John Doe', obtainedMarks: 85, remarks: '' },
        { id: 2, rollNo: '102', name: 'Jane Smith', obtainedMarks: 92, remarks: '' }
    ];

    constructor(private academicService: AcademicManagementService) { }

    ngOnInit(): void { }

    saveMarks(): void {
        const records = this.markSheet.map(s => ({
            studentId: s.id,
            examSubjectId: 1, // Example ID
            obtainedMarks: s.obtainedMarks,
            remarks: s.remarks
        }));
        this.academicService.recordMarks(records).subscribe(() => alert('Marks saved'));
    }
}
