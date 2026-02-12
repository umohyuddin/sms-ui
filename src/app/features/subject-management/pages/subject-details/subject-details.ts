import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectInfoComponent } from '../../components/subject-info/subject-info.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-subject-details',
    standalone: true,
    imports: [CommonModule, SubjectInfoComponent],
    templateUrl: './subject-details.html'
})
export class SubjectDetails implements OnInit {
    subjectId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.subjectId = this.route.snapshot.paramMap.get('id');
    }

    editSubject() {
        if (this.subjectId) {
            this.router.navigate(ROUTES.ACADEMIC.SUBJECTS.EDIT(this.subjectId));
        }
    }
}
