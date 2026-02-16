import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GradeScaleListingTableComponent } from '../../components/grade-scale-listing-table/grade-scale-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-grade-scale-listing',
    standalone: true,
    imports: [CommonModule, GradeScaleListingTableComponent],
    templateUrl: './grade-scale-listing.html'
})
export class GradeScaleListing {
    constructor(private router: Router) { }

    goToCreateGradeScale() {
        this.router.navigate(ROUTES.ACADEMIC.RESULTS.CREATE_GRADE_SCALE);
    }
}
