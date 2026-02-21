import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamSubjectListingTableComponent } from '../../components/exam-subject-listing-table/exam-subject-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-exam-subject-listing',
    standalone: true,
    imports: [CommonModule, ExamSubjectListingTableComponent],
    templateUrl: './exam-subject-listing.html',
    styleUrls: ['./exam-subject-listing.css']
})
export class ExamSubjectListing implements OnInit {
    examId: string = '';

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.examId = this.route.snapshot.queryParamMap.get('examId') || '';
    }

    goToScheduleSubject(): void {
        this.router.navigate(ROUTES.EXAM_SUBJECT_MANAGEMENT.CREATE, { queryParams: { examId: this.examId } });
    }
}
