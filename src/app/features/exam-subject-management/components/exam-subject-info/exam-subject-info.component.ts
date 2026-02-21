import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ExamSubjectManagementService } from '../../services/exam-subject-management.service';
import { ExamSubjectResponse } from '../../models/exam-subject-response';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-exam-subject-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './exam-subject-info.component.html',
    styleUrls: ['./exam-subject-info.component.css']
})
export class ExamSubjectInfoComponent implements OnInit {
    examSubjectData?: ExamSubjectResponse;
    subjectScheduleId!: string;

    constructor(
        private route: ActivatedRoute,
        private service: ExamSubjectManagementService
    ) { }

    ngOnInit(): void {
        this.subjectScheduleId = this.route.snapshot.paramMap.get('id') ?? '';
        if (this.subjectScheduleId) {
            this.getDetails(this.subjectScheduleId);
        }
    }

    getDetails(id: string): void {
        // Assuming there's a getById or we filter from exam's subjects
        // For now, let's just use the listing pattern or assume an endpoint exists
        // this.service.getExamSubjectById(id).subscribe(...);
    }

    getInitials(name?: string): string {
        return SmsUtil.getInitials(name ?? '');
    }
}
