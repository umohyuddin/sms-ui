import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectGroupInfoComponent } from '../../components/subject-group-info/subject-group-info.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-subject-group-details',
    standalone: true,
    imports: [CommonModule, SubjectGroupInfoComponent],
    templateUrl: './subject-group-details.html'
})
export class SubjectGroupDetails implements OnInit {
    groupId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.groupId = this.route.snapshot.paramMap.get('id');
    }

    goBack() {
        this.router.navigate(ROUTES.ACADEMIC.SUBJECT_GROUPS.LIST);
    }

    editGroup() {
        if (this.groupId) {
            this.router.navigate(ROUTES.ACADEMIC.SUBJECT_GROUPS.EDIT(this.groupId));
        }
    }
}
