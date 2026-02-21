import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamSubjectInfoComponent } from '../../components/exam-subject-info/exam-subject-info.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-exam-subject-details',
    standalone: true,
    imports: [ExamSubjectInfoComponent],
    templateUrl: './exam-subject-details.html',
    styleUrls: ['./exam-subject-details.css']
})
export class ExamSubjectDetails implements OnInit {
    routedId: string | null = null;

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.routedId = this.route.snapshot.paramMap.get('id');
    }

    goToUpdatePage(): void {
        if (this.routedId) {
            this.router.navigate(ROUTES.EXAM_SUBJECT_MANAGEMENT.EDIT(this.routedId));
        }
    }
}
