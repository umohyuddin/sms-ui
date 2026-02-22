import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentExamAttendanceTableComponent } from '../../components/student-exam-attendance-table/student-exam-attendance-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
    selector: 'app-student-exam-attendance-listing',
    templateUrl: './student-exam-attendance-listing.html',
    styleUrls: ['./student-exam-attendance-listing.css'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        StudentExamAttendanceTableComponent
    ]
})
export class StudentExamAttendanceListing implements OnInit {
    constructor(private router: Router) { }

    ngOnInit(): void { }

    goToRecordAttendance(): void {
        this.router.navigate(ROUTES.STUDENT_EXAM_ATTENDANCE.CREATE);
    }
}
