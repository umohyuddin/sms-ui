import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamTermListingTableComponent } from '../../components/exam-term-listing-table/exam-term-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-exam-term-listing',
    standalone: true,
    imports: [CommonModule, ExamTermListingTableComponent],
    templateUrl: './exam-term-listing.html'
})
export class ExamTermListing {
    constructor(private router: Router) { }

    goToCreateTerm() {
        this.router.navigate(ROUTES.ACADEMIC.EXAMS.CREATE_TERM);
    }
}
