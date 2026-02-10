import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicManagementService } from '../../services/academic-management.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-exam-schedule',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './exam-schedule.html'
})
export class ExamSchedulePage implements OnInit {
    examId: string | null = null;
    examName = 'Final Term Exam';
    subjects: any[] = [];

    constructor(
        private academicService: AcademicManagementService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.examId = this.route.snapshot.queryParamMap.get('examId');
        if (this.examId) this.loadSchedule();
    }

    loadSchedule() {
        this.academicService.getExamSubjects(this.examId!).subscribe(resp => {
            this.subjects = resp.body || [];
        });
    }

    openScheduleModal() {
        // Logic to open a form/modal
        const subjectId = prompt('Subject ID');
        const date = prompt('Date (YYYY-MM-DD)');
        if (subjectId && date) {
            const payload = {
                examId: +this.examId!,
                subjectId: +subjectId,
                examDate: date,
                startTime: '09:00:00',
                endTime: '12:00:00',
                maxMarks: 100,
                minPassMarks: 33
            };
            this.academicService.scheduleExamSubject(payload).subscribe(() => this.loadSchedule());
        }
    }

    deleteSchedule(id: number) {
        // delete
    }

    goToMarksEntry(examSubjectId: number) {
        this.router.navigate(ROUTES.ACADEMIC.RESULTS.MARKS_ENTRY, { queryParams: { examSubjectId } });
    }
}
