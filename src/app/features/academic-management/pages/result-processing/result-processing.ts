import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicManagementService } from '../../services/academic-management.service';

@Component({
    selector: 'app-result-processing',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './result-processing.html'
})
export class ResultProcessingPage implements OnInit {
    filters = { examTermId: '', standardId: 1, sectionId: 1 };
    examTerms: any[] = [];
    standards: any[] = [];
    sections: any[] = [];
    loading = false;
    resultSummary: any = null;

    constructor(private academicService: AcademicManagementService) { }

    ngOnInit(): void {
        this.loadInitialData();
    }

    loadInitialData() {
        this.academicService.getExamTerms(1).subscribe(resp => this.examTerms = resp.body || []);
    }

    processResults() {
        this.loading = true;
        this.academicService.processResults(this.filters.standardId, this.filters.sectionId, +this.filters.examTermId).subscribe({
            next: (resp) => {
                this.resultSummary = resp.body || {
                    studentCount: 2,
                    records: [
                        { studentName: 'John Doe', obtainedMarks: 450, totalMarks: 500, percentage: 90, grade: 'A+', status: 'PASS' },
                        { studentName: 'Jane Smith', obtainedMarks: 480, totalMarks: 500, percentage: 96, grade: 'A+', status: 'PASS' }
                    ]
                };
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    viewReportCard(record: any) {
        // Logic for viewing report card
        console.log('Viewing report card for:', record.studentName);
    }
}
