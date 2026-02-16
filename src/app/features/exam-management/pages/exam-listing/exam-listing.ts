import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamListingTableComponent } from '../../components/exam-listing-table/exam-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-exam-mgmt-listing',
    standalone: true,
    imports: [CommonModule, ExamListingTableComponent],
    templateUrl: './exam-listing.html',
})
export class ExamMgmtListing implements OnInit {

    constructor(private router: Router) { }

    ngOnInit(): void { }

    onCreateExam() {
        this.router.navigate(['/exams/create']);
    }
}
