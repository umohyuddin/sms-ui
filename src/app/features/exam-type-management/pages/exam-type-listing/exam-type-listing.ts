import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamTypeListingTableComponent } from '../../components/exam-type-listing-table/exam-type-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
    selector: 'app-exam-type-listing',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ExamTypeListingTableComponent
    ],
    templateUrl: './exam-type-listing.html'
})
export class ExamTypeListing implements OnInit {
    constructor(
        private router: Router,
        private logger: LoggerService
    ) { }

    ngOnInit(): void {
        this.logger.group('ExamTypeListing');
        this.logger.info('Initializing exam type listing page');
        this.logger.groupEnd();
    }

    goToCreateExamType(): void {
        this.logger.info('Navigating to create exam type');
        this.router.navigate(ROUTES.ACADEMIC.EXAMS.CREATE_TYPE);
    }
}
