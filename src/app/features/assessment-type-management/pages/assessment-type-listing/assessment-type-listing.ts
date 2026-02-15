import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AssessmentTypeListingTableComponent } from '../../components/assessment-type-listing-table/assessment-type-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-assessment-type-listing',
    standalone: true,
    imports: [CommonModule, AssessmentTypeListingTableComponent],
    templateUrl: './assessment-type-listing.html'
})
export class AssessmentTypeListing {
    constructor(private router: Router) { }

    goToCreateAssessmentType() {
        this.router.navigate(ROUTES.ACADEMIC.EXAMS.CREATE_ASSESSMENT_TYPE);
    }
}
