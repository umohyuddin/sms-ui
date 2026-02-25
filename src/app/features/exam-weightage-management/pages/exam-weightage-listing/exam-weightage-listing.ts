import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamWeightageListingTableComponent } from '../../components/exam-weightage-listing-table/exam-weightage-listing-table.component';
// Assuming ROUTES will be updated later, using a placeholder or common pattern
const ROUTES_EXAM_WEIGHTAGE = {
    CREATE: '/exam-weightage-management/create'
};

@Component({
    selector: 'app-exam-weightage-listing',
    imports: [
        CommonModule,
        FormsModule,
        ExamWeightageListingTableComponent
    ],
    templateUrl: './exam-weightage-listing.html',
    styleUrls: ['./exam-weightage-listing.css'],
    standalone: true,
})
export class ExamWeightageListing implements OnInit {
    constructor(private router: Router) { }

    ngOnInit(): void { }

    goToCreateWeightage(): void {
        this.router.navigate([ROUTES_EXAM_WEIGHTAGE.CREATE]);
    }
}
