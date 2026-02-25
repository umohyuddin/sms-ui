import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamWeightageInfoComponent } from '../../components/exam-weightage-info/exam-weightage-info.component';

@Component({
    selector: 'app-exam-weightage-details',
    imports: [ExamWeightageInfoComponent],
    templateUrl: './exam-weightage-details.html',
    styleUrls: ['./exam-weightage-details.css'],
    standalone: true,
})
export class ExamWeightageDetails implements OnInit {
    routedId: number | null = null;

    constructor(private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            this.routedId = id ? +id : null;
        });
    }

    goToUpdatePage() {
        if (this.routedId) {
            this.router.navigate(['/exam-weightage-management/edit', this.routedId]);
        }
    }
}
