import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectGroupListingTableComponent } from '../../components/subject-group-listing-table/subject-group-listing-table.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-subject-group-listing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SubjectGroupListingTableComponent
  ],
  templateUrl: './subject-group-listing.html'
})
export class SubjectGroupListing implements OnInit {
  constructor(
    private router: Router,
    private logger: LoggerService
  ) { }

  ngOnInit(): void {
    this.logger.group('SubjectGroupListing');
    this.logger.info('Initializing subject group listing page');
    this.logger.groupEnd();
  }

  goToCreateGroup(): void {
    this.logger.info('Navigating to create subject group');
    this.router.navigate(ROUTES.ACADEMIC.SUBJECT_GROUPS.CREATE);
  }
}
