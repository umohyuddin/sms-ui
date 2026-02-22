import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentExamMarksTableComponent } from '../../components/student-exam-marks-table/student-exam-marks-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-student-exam-marks-listing',
    templateUrl: './student-exam-marks-listing.html',
    styleUrls: ['./student-exam-marks-listing.css'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        StudentExamMarksTableComponent
    ]
})
export class StudentExamMarksListing implements OnInit {
    constructor(private router: Router) { }

    ngOnInit(): void { }

    goToEnterMarks(): void {
        this.router.navigate(ROUTES.STUDENT_EXAM_MARKS.CREATE);
    }
}
