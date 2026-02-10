import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectListingTableComponent } from '../../components/subject-listing-table/subject-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-subject-listing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SubjectListingTableComponent
  ],
  templateUrl: './subject-listing.html'
})
export class SubjectListing implements OnInit {
  constructor(
    private router: Router,
    private logger: LoggerService
  ) { }

  ngOnInit(): void {
    this.logger.group('SubjectListing');
    this.logger.info('Initializing subject listing page');
    this.logger.groupEnd();
  }

  goToCreateSubject(): void {
    this.logger.info('Navigating to create subject');
    this.router.navigate(ROUTES.ACADEMIC.SUBJECTS.CREATE);
  }
}
