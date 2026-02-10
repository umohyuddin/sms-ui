import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AcademicManagementService } from '../../services/academic-management.service';

@Component({
    selector: 'app-marks-entry',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './marks-entry.html'
})
export class MarksEntryPage implements OnInit {
    examSubjectId: string | null = null;
    subjectName = 'Mathematics';
    maxMarks = 100;
    markSheet: any[] = [];
    loading = false;

    constructor(
        private academicService: AcademicManagementService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.examSubjectId = this.route.snapshot.queryParamMap.get('examSubjectId');
        if (this.examSubjectId) this.loadMarkSheet();
    }

    loadMarkSheet() {
        this.academicService.getMarksByExamSubject(this.examSubjectId!).subscribe(resp => {
            const existing: any[] = resp.body || [];
            // Mocking student list for demo
            this.markSheet = [
                { studentId: 1, rollNo: '101', studentName: 'John Doe', obtainedMarks: 0, isAbsent: false, remarks: '' },
                { studentId: 2, rollNo: '102', studentName: 'Jane Smith', obtainedMarks: 0, isAbsent: false, remarks: '' }
            ];
            // Merge
            this.markSheet.forEach(s => {
                const row = existing.find(e => e.studentId === s.studentId);
                if (row) {
                    s.obtainedMarks = row.obtainedMarks;
                    s.isAbsent = row.isAbsent;
                    s.remarks = row.remarks;
                }
            });
        });
    }

    saveMarks() {
        this.loading = true;
        const records = this.markSheet.map(s => ({
            examSubjectId: +this.examSubjectId!,
            studentId: s.studentId,
            obtainedMarks: s.obtainedMarks,
            isAbsent: s.isAbsent,
            remarks: s.remarks
        }));
        this.academicService.recordExamMarks(records).subscribe({
            next: () => {
                alert('Marks recorded successfully');
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }
}
